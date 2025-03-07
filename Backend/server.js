
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');
const Redis = require('redis');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Redis client (if Redis URL is provided)
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = Redis.createClient({
    url: process.env.REDIS_URL
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
  
  redisClient.connect().catch(console.error);
}

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// AI generation endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt, maxTokens = 50 } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    // Check cache first if Redis is available
    if (redisClient) {
      const cachedResponse = await redisClient.get(`prompt:${prompt}`);
      if (cachedResponse) {
        console.log('Cache hit for prompt:', prompt);
        return res.json(JSON.parse(cachedResponse));
      }
    }
    
    // Execute Python script for DeepSeek integration
    const python = spawn('python', [
      '-c', 
      `
import asyncio
import sys
import json
sys.path.append('./DeepSeek')
from DeepSeekIntegration import generate_text

async def main():
    result = await generate_text("${prompt.replace(/"/g, '\\"')}", ${maxTokens})
    print(json.dumps(result))

asyncio.run(main())
      `
    ]);
    
    let result = '';
    
    python.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    python.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Failed to generate text' });
      }
      
      try {
        const parsedResult = JSON.parse(result);
        
        // Store in Redis cache if available
        if (redisClient) {
          await redisClient.set(
            `prompt:${prompt}`, 
            JSON.stringify(parsedResult),
            { EX: 3600 } // Cache for 1 hour
          );
        }
        
        res.json(parsedResult);
      } catch (parseError) {
        console.error('Error parsing result:', parseError);
        res.status(500).json({ error: 'Invalid response format' });
      }
    });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// System metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
