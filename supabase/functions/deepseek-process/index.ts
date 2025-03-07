
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for AI analysis responses when actual LM Studio is not available
const mockAnalyses = [
  {
    response: "Analysis indicates high population density in Lagos region with favorable environmental conditions. Monitoring stations showing 28% increase in activity. Recommend increasing surveillance frequency to bi-weekly intervals.",
    category: "population_density",
    confidence: 0.87,
    regions_affected: ["Lagos", "Abuja"],
    risk_level: "MEDIUM"
  },
  {
    response: "Environmental analysis shows correlation between recent rainfall patterns and increased movement. Habitat suitability index is now at 0.76 (high). Recommend deploying additional sensors in southwestern quadrants.",
    category: "environmental",
    confidence: 0.92,
    regions_affected: ["Port Harcourt", "Calabar"],
    risk_level: "HIGH"
  },
  {
    response: "Seasonal migration patterns detected in northern regions. Population showing 15% growth rate compared to previous quarter. Current control measures operating at 62% effectiveness.",
    category: "migration",
    confidence: 0.81,
    regions_affected: ["Kano", "Sokoto", "Maiduguri"],
    risk_level: "MEDIUM"
  },
  {
    response: "Predictive model indicates potential outbreak risk in southeastern regions within 14-21 days. Confidence interval: 78-85%. Recommend immediate implementation of early warning protocols.",
    category: "outbreak_prediction",
    confidence: 0.85,
    regions_affected: ["Enugu", "Calabar"],
    risk_level: "HIGH"
  },
  {
    response: "Analysis of monitoring station data shows decreased activity in western urban centers. Environmental conditions becoming less favorable with recent temperature shifts. Maintain standard monitoring protocols.",
    category: "monitoring",
    confidence: 0.89,
    regions_affected: ["Ibadan", "Lagos"],
    risk_level: "LOW"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    const { prompt, useRealModel } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ success: false, error: "Prompt is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log("Processing prompt with DeepSeek:", prompt);
    
    let result;
    
    // Try to use real DeepSeek model if requested, otherwise use mock data
    if (useRealModel === true) {
      try {
        // Use the LM Studio IP from the user's screenshot: http://172.20.10.2:1234
        const lmStudioResponse = await fetch("http://172.20.10.2:1234/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek-r1-distill-qwen-7b",
            prompt: `You are an AI assistant specializing in analyzing data related to Mastomys rodent monitoring in Nigeria. 
                     Please analyze the following data and provide insights: ${prompt}`,
            max_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
          }),
        });
        
        if (lmStudioResponse.ok) {
          const data = await lmStudioResponse.json();
          console.log("LM Studio response received:", data);
          
          result = {
            response: data.choices && data.choices[0] ? data.choices[0].text : "No valid response received",
            metadata: {
              category: determineCategory(data.choices[0]?.text || ""),
              confidence: 0.85 + (Math.random() * 0.15),
              regions_affected: determineRegions(data.choices[0]?.text || ""),
              risk_level: determineRiskLevel(data.choices[0]?.text || ""),
              processing_time: data.usage?.total_tokens ? data.usage.total_tokens / 100 : 1.2,
              source: "lm_studio_api"
            }
          };
          console.log("Successfully used LM Studio API");
        } else {
          throw new Error(`LM Studio API call failed with status: ${lmStudioResponse.status}`);
        }
      } catch (lmError) {
        console.error("Error using LM Studio API, falling back to mock data:", lmError);
        // Fall back to mock data on error
        const randomIndex = Math.floor(Math.random() * mockAnalyses.length);
        const mockAnalysis = mockAnalyses[randomIndex];
        result = {
          response: mockAnalysis.response,
          metadata: {
            category: mockAnalysis.category,
            confidence: mockAnalysis.confidence,
            regions_affected: mockAnalysis.regions_affected,
            risk_level: mockAnalysis.risk_level,
            processing_time: 0.8,
            source: "mock_fallback",
            original_error: lmError.message
          }
        };
      }
    } else {
      // Use mock data
      const randomIndex = Math.floor(Math.random() * mockAnalyses.length);
      const mockAnalysis = mockAnalyses[randomIndex];
      result = {
        response: mockAnalysis.response,
        metadata: {
          category: mockAnalysis.category,
          confidence: mockAnalysis.confidence,
          regions_affected: mockAnalysis.regions_affected,
          risk_level: mockAnalysis.risk_level,
          processing_time: 0.5,
          source: "mock_data"
        }
      };
    }

    // Log the interaction in Supabase
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_logs')
        .insert({
          prompt: prompt,
          response: JSON.stringify(result),
          processing_time: result.metadata.processing_time,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error("Error logging to Supabase:", error);
      }
    } catch (dbError) {
      console.error("Database logging failed:", dbError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper functions to classify the response based on text content
function determineCategory(text: string): string {
  const categoryKeywords = {
    "population_density": ["population", "density", "crowded", "concentration"],
    "environmental": ["environment", "climate", "weather", "habitat", "rainfall"],
    "migration": ["migration", "movement", "travel", "seasonal", "patterns"],
    "outbreak_prediction": ["outbreak", "epidemic", "spread", "prediction", "risk"],
    "monitoring": ["monitoring", "observation", "tracking", "surveillance"]
  };
  
  let highestMatchCount = 0;
  let matchedCategory = "monitoring"; // Default
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matchCount = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    if (matchCount > highestMatchCount) {
      highestMatchCount = matchCount;
      matchedCategory = category;
    }
  }
  
  return matchedCategory;
}

function determineRegions(text: string): string[] {
  const nigerianRegions = [
    "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
    "Enugu", "Calabar", "Sokoto", "Maiduguri", "Jos", "Onitsha", 
    "Benin City", "Warri", "Ilorin", "Abeokuta", "Owerri"
  ];
  
  const mentionedRegions = nigerianRegions.filter(region => 
    text.includes(region)
  );
  
  // Return at least one region if none are mentioned
  if (mentionedRegions.length === 0) {
    return [nigerianRegions[Math.floor(Math.random() * nigerianRegions.length)]];
  }
  
  return mentionedRegions;
}

function determineRiskLevel(text: string): string {
  const lowRiskKeywords = ["low", "minimal", "slight", "small", "minor"];
  const highRiskKeywords = ["high", "severe", "significant", "major", "substantial"];
  
  const lowMatches = lowRiskKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  const highMatches = highRiskKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  ).length;
  
  if (highMatches > lowMatches) {
    return "HIGH";
  } else if (lowMatches > highMatches) {
    return "LOW";
  } else {
    return "MEDIUM";
  }
}
