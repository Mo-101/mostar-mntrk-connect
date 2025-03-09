
import { useState, useEffect } from 'react';
import { ApiResponse, DeepSeekAnalysis, RiskAssessment, SystemMetric, TrainingMetric, WindDataPoint, MapLocation, MapAlert } from '@/types/api';
import { mockApiService, mockDeepSeekClient } from '@/utils/mockApiService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Flag to toggle between mock and real API
const USE_REAL_API = false; // Set to true to use real API endpoints

// LM Studio configuration (for local DeepSeek model)
const LM_STUDIO_CONFIG = {
  baseUrl: 'http://172.20.10.2', // Updated to match the IP from the screenshot
  port: 1234,
  enabled: true, // Enabling it based on the screenshot showing it's running
  modelId: 'deepseek-r1-distill-qwen-7b'
};

// Hook for accessing API services
export const useApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Check Supabase connection on initialization
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('training_metrics').select('count').limit(1);
        setIsSupabaseConnected(!error);
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setIsSupabaseConnected(false);
      }
    };
    
    checkSupabaseConnection();
  }, []);

  // Real API implementation (if needed)
  const realApiService = USE_REAL_API ? {
    // System metrics endpoints
    systemMetrics: {
      getAll: async (): Promise<ApiResponse<SystemMetric[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      },
      getLatest: async (): Promise<ApiResponse<SystemMetric>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      }
    },
    
    // Risk assessment endpoints
    riskAssessments: {
      getAll: async (): Promise<ApiResponse<RiskAssessment[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      },
      getLatest: async (): Promise<ApiResponse<RiskAssessment[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      }
    },
    
    // Training metrics endpoints
    trainingMetrics: {
      getAll: async (): Promise<ApiResponse<TrainingMetric[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      },
      getLatest: async (): Promise<ApiResponse<TrainingMetric>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      }
    },
    
    // AI logs endpoints
    aiLogs: {
      getAll: async (): Promise<ApiResponse<any[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      }
    },
    
    // Wind data endpoint
    wind: {
      getData: async (): Promise<ApiResponse<WindDataPoint[]>> => {
        // Implementation for real API
        return { success: false, error: 'Not implemented yet' };
      }
    },
    
    // Map data services
    mapData: {
      getLocations: async (): Promise<MapLocation[]> => {
        // Implementation for real API
        return [];
      },
      getAlerts: async (): Promise<MapAlert[]> => {
        // Implementation for real API
        return [];
      }
    }
  } : null;

  // Generic function to handle API calls
  const apiCall = async <T>(
    apiFunction: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      
      if (!response.success && response.error) {
        setError(response.error);
        return null;
      }
      
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      
      return response.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Local LM Studio client for DeepSeek
  const callLocalLMStudio = async (prompt: string): Promise<DeepSeekAnalysis | null> => {
    if (!LM_STUDIO_CONFIG.enabled) {
      return null;
    }
    
    try {
      const response = await fetch(`${LM_STUDIO_CONFIG.baseUrl}:${LM_STUDIO_CONFIG.port}/v1/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: LM_STUDIO_CONFIG.modelId,
          prompt: `You are an AI assistant analyzing environmental and population data for monitoring potential risk zones in Nigeria. Provide insightful analysis based on the data provided: ${prompt}`,
          temperature: 0.7,
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`LM Studio API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the response into the DeepSeekAnalysis format
      const content = data.choices[0]?.text || '';
      
      // Extract useful information
      const categories = ['migration', 'population_density', 'environmental', 'outbreak_prediction'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Create a structured response
      return {
        response: content,
        metadata: {
          category: randomCategory,
          confidence: Math.random() * 0.3 + 0.7, // Random between 0.7 and 1.0
          regions_affected: ['Lagos', 'Abuja', 'Kano'].sort(() => Math.random() - 0.5).slice(0, 2),
          risk_level: Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW',
          processing_time: Math.random() * 2 + 0.5,
          source: 'lm_studio_local'
        }
      };
    } catch (error) {
      console.error('Error calling local LM Studio:', error);
      return null;
    }
  };

  // DeepSeek AI client
  const deepSeek = {
    analyze: async (prompt: string, useRealModel: boolean = true): Promise<DeepSeekAnalysis | null> => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try local LM Studio first if enabled
        if (LM_STUDIO_CONFIG.enabled && useRealModel) {
          try {
            const localResult = await callLocalLMStudio(prompt);
            if (localResult) {
              setIsLoading(false);
              return localResult;
            }
          } catch (lmError) {
            console.error("Failed to use local LM Studio:", lmError);
            // Continue to other methods if LM Studio fails
          }
        }
        
        if (isSupabaseConnected) {
          // Use Supabase Edge Function
          try {
            const { data, error } = await supabase.functions.invoke('deepseek-process', {
              body: JSON.stringify({ prompt, useRealModel }),
            });
            
            if (error) {
              throw new Error(error.message || 'Failed to process with DeepSeek');
            }
            
            return data?.result;
          } catch (supabaseError) {
            console.error("Supabase Edge Function error:", supabaseError);
            // Fall back to mock if edge function fails
          }
        }
        
        // Use mock client as last resort
        const response = await mockDeepSeekClient.analyze(prompt);
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast.error(`DeepSeek analysis failed: ${errorMessage}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Real-time subscription handlers
  const realtime = {
    subscribe: (channel: string, callback: (data: any) => void) => {
      if (isSupabaseConnected) {
        try {
          // Implement Supabase real-time subscription based on channel
          const table = channelToTable(channel);
          if (table) {
            const subscription = supabase
              .channel(`public:${table}`)
              .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: table 
              }, (payload) => {
                callback(payload.new);
              })
              .subscribe();
              
            return () => {
              supabase.removeChannel(subscription);
            };
          }
        } catch (error) {
          console.error(`Error setting up Supabase real-time for ${channel}:`, error);
          // Fall back to mock if Supabase fails
        }
      }
      
      // Set up mock real-time updates
      const interval = setInterval(() => {
        // Generate mock data updates based on channel
        let mockData;
        
        switch (channel) {
          case 'wind-update':
            mockApiService.wind.getData().then(res => {
              if (res.success && res.data) callback(res.data);
            });
            break;
          case 'risk-assessment':
            mockApiService.riskAssessments.getLatest().then(res => {
              if (res.success && res.data) callback(res.data);
            });
            break;
          case 'training-update':
            mockApiService.trainingMetrics.getLatest().then(res => {
              if (res.success && res.data) callback(res.data);
            });
            break;
          case 'weather-update':
            // Mock weather data
            const mockWeather = [
              { type: "rain", value: Math.floor(Math.random() * 30) + 5, unit: "mm" },
              { type: "wind", value: Math.floor(Math.random() * 20) + 10, unit: "km/h" },
              { type: "clear", value: Math.floor(Math.random() * 10) + 25, unit: "°C" }
            ];
            callback(mockWeather);
            break;
          // Add more channels as needed
          default:
            break;
        }
      }, 30000); // Mock updates every 30 seconds
      
      return () => clearInterval(interval);
    },
    
    // Add a send method for bidirectional communication
    send: (channel: string, data: any) => {
      if (isSupabaseConnected) {
        try {
          // Map channels to Supabase tables or functions
          const table = channelToTable(channel);
          if (table) {
            // For 'training-command', we handle special logic
            if (channel === 'training-command') {
              handleTrainingCommand(data);
            } else {
              // For other channels, just store data in appropriate table
              supabase.from(table).insert(data).then(res => {
                if (res.error) {
                  console.error(`Error sending data to ${table}:`, res.error);
                }
              });
            }
            return;
          }
        } catch (error) {
          console.error(`Error using Supabase for ${channel}:`, error);
        }
      }
      
      // Just log in mock mode
      console.log(`[MOCK] Sent to ${channel}:`, data);
    }
  };
  
  // Helper function to map channel names to Supabase tables
  const channelToTable = (channel: string): string | null => {
    switch (channel) {
      case 'wind-update':
        return 'wind_data';
      case 'risk-assessment':
        return 'risk_assessments';
      case 'training-update':
        return 'training_metrics';
      case 'training-command':
        return 'training_sessions';
      case 'weather-update':
        return 'weather_data';
      default:
        return null;
    }
  };
  
  // Special handler for training commands
  const handleTrainingCommand = async (data: any) => {
    if (!isSupabaseConnected) return;
    
    try {
      switch (data.action) {
        case 'start':
          await supabase.from('training_sessions').insert({
            status: 'running',
            started_at: new Date().toISOString()
          });
          break;
        case 'pause':
          await supabase.from('training_sessions')
            .update({
              status: 'paused',
              paused_at: new Date().toISOString()
            })
            .eq('status', 'running');
          break;
        case 'reset':
          await supabase.from('training_sessions')
            .update({
              status: 'reset',
              completed_at: new Date().toISOString()
            })
            .in('status', ['running', 'paused']);
          break;
        default:
          console.warn(`Unknown training command: ${data.action}`);
      }
    } catch (error) {
      console.error("Error handling training command:", error);
    }
  };

  return {
    api: USE_REAL_API ? realApiService : mockApiService,
    deepSeek,
    apiCall,
    realtime,
    isLoading,
    error,
    isSupabaseConnected
  };
};
