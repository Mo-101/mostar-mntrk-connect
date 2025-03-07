// Define the proper exports and functions for the useApi hook
import { supabase, USE_MOCK_DATA } from "@/integrations/supabase/client";
import { useState } from "react";
import { RiskAssessment, DeepSeekAnalysis, TrainingMetric } from "@/types/api";
import { RealtimeService } from "@/services/apiService";

// Only updating the channelToTable function to fix the error related to 'wind_data' table
const channelToTable = (channel: string): string | null => {
  switch (channel) {
    case 'wind-update':
      // Return an existing table or null if we're in mock mode
      return USE_MOCK_DATA ? null : 'environmental_data';
    case 'risk-assessment':
      return 'risk_assessments';
    case 'training-update':
      return 'training_metrics';
    case 'training-command':
      return 'training_sessions';
    case 'weather-update':
      return 'environmental_data';
    default:
      return null;
  }
};

// Mock API responses for development
const mockResponses: Record<string, any> = {
  mapData: {
    getLocations: () => [
      {
        id: 1,
        name: "Abuja",
        type: "urban",
        risk_level: "MEDIUM",
        coordinates: [7.4951, 9.0579]
      },
      {
        id: 2,
        name: "Lagos",
        type: "coastal",
        risk_level: "HIGH",
        coordinates: [3.3792, 6.5244]
      },
      {
        id: 3,
        name: "Kano",
        type: "northern",
        risk_level: "LOW",
        coordinates: [8.5167, 12.0000]
      }
    ]
  },
  wind: {
    getData: () => ({
      success: true,
      data: Array(5).fill(null).map((_, i) => ({
        id: `wind-${i}`,
        coordinates: [8.6753 + (Math.random() - 0.5), 9.0820 + (Math.random() - 0.5)],
        u: (Math.random() - 0.5) * 10,
        v: (Math.random() - 0.5) * 10,
        speed: 5 + Math.random() * 5,
        direction: Math.random() * 360,
        timestamp: new Date().toISOString(),
        position: {
          longitude: 8.6753 + (Math.random() - 0.5),
          latitude: 9.0820 + (Math.random() - 0.5),
          altitude: 10000 + Math.random() * 5000
        },
        weather: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)]
      }))
    })
  },
  riskAssessments: {
    getLatest: () => ({
      success: true,
      data: [
        {
          id: 1,
          region: "Lagos",
          risk_level: "MEDIUM",
          assessment_date: new Date().toISOString(),
          mitigation_measures: [
            "Increase environmental monitoring frequency",
            "Deploy additional surveillance sensors",
            "Implement community reporting system"
          ],
          details: {
            environmental_factors: ["Moderate rainfall", "Urban density"],
            population_density: 1265,
            historical_data: "Moderate risk patterns identified"
          }
        }
      ]
    })
  },
  trainingMetrics: {
    getLatest: () => ({
      success: true,
      data: {
        id: 1,
        epoch: 25,
        accuracy: 0.85,
        loss: 0.15,
        val_accuracy: 0.82,
        val_loss: 0.18,
        timestamp: new Date().toISOString()
      }
    })
  }
};

// Create a mock deepseek client
const mockDeepSeekClient = {
  analyze: async (prompt: string, useMock = true): Promise<DeepSeekAnalysis> => {
    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      response: `Analysis of "${prompt}" complete. Weather patterns indicate seasonal changes affecting monitoring regions.`,
      metadata: {
        category: ["migration", "environmental", "outbreak_prediction"][Math.floor(Math.random() * 3)],
        confidence: 0.75 + Math.random() * 0.2,
        regions_affected: ["Lagos", "Abuja", "Kano"].slice(0, Math.floor(Math.random() * 3) + 1),
        risk_level: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
        processing_time: 0.8 + Math.random(),
        source: "mock_data"
      }
    };
  }
};

// Create a mock realtime service
const mockRealtimeService = {
  subscribe: (channel: string, callback: (data: any) => void) => {
    console.log(`Subscribed to ${channel} channel`);
    
    // For training-update channel, simulate periodic updates
    if (channel === 'training-update') {
      const interval = setInterval(() => {
        const currentEpoch = Math.floor(Math.random() * 50) + 1;
        const accuracy = Math.min(0.5 + (currentEpoch / 50) * 0.45, 0.95);
        const loss = Math.max(0.5 - (currentEpoch / 50) * 0.45, 0.05);
        
        callback({
          epoch: currentEpoch,
          accuracy,
          loss
        });
      }, 10000);
      
      // Return unsubscribe function
      return () => clearInterval(interval);
    }
    
    // For risk-assessment channel, simulate occasional updates
    if (channel === 'risk-assessment') {
      const interval = setInterval(() => {
        callback([{
          id: Date.now(),
          region: ["Lagos", "Abuja", "Kano"][Math.floor(Math.random() * 3)],
          risk_level: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
          assessment_date: new Date().toISOString(),
          mitigation_measures: [
            "Increase environmental monitoring frequency",
            "Deploy additional surveillance sensors"
          ]
        }]);
      }, 30000);
      
      return () => clearInterval(interval);
    }
    
    // Default unsubscribe function
    return () => console.log(`Unsubscribed from ${channel} channel`);
  },
  
  send: (channel: string, data: any) => {
    console.log(`Sending to ${channel} channel:`, data);
  }
};

// Implement API methods based on mock data or real Supabase queries
const api = {
  mapData: {
    getLocations: async () => {
      if (USE_MOCK_DATA) {
        return mockResponses.mapData.getLocations();
      }
      
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    }
  },
  wind: {
    getData: async () => {
      if (USE_MOCK_DATA) {
        return mockResponses.wind.getData();
      }
      
      try {
        const { data, error } = await supabase
          .from('environmental_data')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        return { success: true, data };
      } catch (error) {
        console.error('Error fetching wind data:', error);
        return { success: false, error: 'Failed to fetch wind data' };
      }
    }
  },
  riskAssessments: {
    getLatest: async () => {
      if (USE_MOCK_DATA) {
        return mockResponses.riskAssessments.getLatest().data;
      }
      
      try {
        const { data, error } = await supabase
          .from('risk_assessments')
          .select('*')
          .order('assessment_date', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        return data.map((item: any) => ({
          id: item.id,
          region: item.location_id ? `Region ${item.location_id}` : 'Unknown',
          risk_level: item.risk_level.toUpperCase(),
          assessment_date: item.assessment_date,
          mitigation_measures: item.mitigation_measures || [],
          details: {
            environmental_factors: (typeof item.factors === 'object' && item.factors?.environmental_factors) || [],
            population_density: (typeof item.factors === 'object' && item.factors?.population_density) || 0,
            historical_data: (typeof item.factors === 'object' && item.factors?.historical_data) || ''
          }
        }));
      } catch (error) {
        console.error('Error fetching risk assessments:', error);
        return [];
      }
    }
  },
  trainingMetrics: {
    getLatest: async () => {
      if (USE_MOCK_DATA) {
        return mockResponses.trainingMetrics.getLatest().data;
      }
      
      try {
        const { data, error } = await supabase
          .from('training_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error) throw error;
        
        return {
          id: data.id,
          epoch: data.epoch,
          accuracy: data.accuracy,
          loss: data.loss,
          val_accuracy: data.val_accuracy || data.accuracy,
          val_loss: data.val_loss || data.loss,
          timestamp: data.created_at
        };
      } catch (error) {
        console.error('Error fetching training metrics:', error);
        return mockResponses.trainingMetrics.getLatest().data;
      }
    }
  }
};

// Custom hook for API access
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state for ConversationBox

  // General-purpose API call function
  const apiCall = async <T extends unknown>(
    callback: () => Promise<T>,
    errorMessage = "API call failed"
  ): Promise<T | null> => {
    setLoading(true);
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callback();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  // Add deepSeek client for the DeepSeekInsights component
  const deepSeek = {
    analyze: async (prompt: string, useMock = true): Promise<DeepSeekAnalysis> => {
      setIsLoading(true);
      try {
        if (USE_MOCK_DATA || useMock) {
          const response = await mockDeepSeekClient.analyze(prompt);
          return response;
        }
        
        // Add real implementation here when needed
        throw new Error("Real DeepSeek API not implemented");
      } catch (error) {
        console.error("Error calling DeepSeek API:", error);
        return mockDeepSeekClient.analyze(prompt, true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Add realtime service for components that need it
  const realtime = mockRealtimeService;

  return { apiCall, loading, error, api, deepSeek, isLoading, realtime };
};

// Also export the api object directly for simpler imports
export { api };
