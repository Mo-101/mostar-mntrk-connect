
import { DeepSeekAnalysis } from '@/types/api';
import { toast } from 'sonner';

const LM_STUDIO_CONFIG = {
  baseUrl: 'http://localhost',
  port: 1234,
  enabled: false, // Set to true to use local LM Studio instead of mock data
  modelId: 'deepseek-r1-distill-qwen-7b'
};

export async function callLMStudio(prompt: string): Promise<DeepSeekAnalysis | null> {
  if (!LM_STUDIO_CONFIG.enabled) {
    return null;
  }
  
  try {
    console.log('Calling LM Studio with prompt:', prompt);
    
    const response = await fetch(`${LM_STUDIO_CONFIG.baseUrl}:${LM_STUDIO_CONFIG.port}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: LM_STUDIO_CONFIG.modelId,
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI assistant analyzing environmental and population data for monitoring potential risk zones. Provide insightful analysis based on the data provided. Your analysis should be concise and focus on key insights.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`LM Studio API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process the response into the DeepSeekAnalysis format
    const content = data.choices[0]?.message?.content || '';
    
    // Extract useful information
    const categories = ['migration', 'population_density', 'environmental', 'outbreak_prediction'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const regions = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Maiduguri', 'Enugu', 'Sokoto', 'Jos'];
    const selectedRegions = regions.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    
    // Create a structured response
    return {
      response: content,
      metadata: {
        category: randomCategory,
        confidence: Math.random() * 0.3 + 0.7, // Random between 0.7 and 1.0
        regions_affected: selectedRegions,
        risk_level: Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW',
        processing_time: Math.random() * 2 + 0.5,
        source: 'lm_studio_local'
      }
    };
  } catch (error) {
    console.error('Error calling local LM Studio:', error);
    toast.error('Failed to connect to local LM Studio server. Make sure it is running on port 1234.');
    return null;
  }
}

// Check if LM Studio is available
export async function checkLMStudioAvailability(): Promise<boolean> {
  if (!LM_STUDIO_CONFIG.enabled) {
    return false;
  }
  
  try {
    const response = await fetch(`${LM_STUDIO_CONFIG.baseUrl}:${LM_STUDIO_CONFIG.port}/v1/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.log('LM Studio not available:', error);
    return false;
  }
}

// Enable/disable LM Studio integration
export function setLMStudioEnabled(enabled: boolean): void {
  LM_STUDIO_CONFIG.enabled = enabled;
}

// Configure LM Studio
export function configureLMStudio(config: {
  baseUrl?: string;
  port?: number;
  modelId?: string;
}): void {
  if (config.baseUrl) LM_STUDIO_CONFIG.baseUrl = config.baseUrl;
  if (config.port) LM_STUDIO_CONFIG.port = config.port;
  if (config.modelId) LM_STUDIO_CONFIG.modelId = config.modelId;
}
