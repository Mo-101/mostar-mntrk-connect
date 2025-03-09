import { mockApiService, mockDeepSeekClient } from '@/utils/mockApiService';
import { fetchMapLocations, fetchMapAlerts } from '@/utils/mapUtils';
import { ApiResponse, SystemMetric, RiskAssessment, TrainingMetric, AILog } from '@/types/api';
import { WindDataPoint } from '@/types/wind';
import { supabase } from "@/integrations/supabase/client";

// Configuration to toggle between mock and real data
const USE_REAL_API = false; // Toggle this to switch between mock and real data

/**
 * API Service that can switch between mock and real data 
 * to simplify the transition from development to production
 */
export const apiService = {
  // System metrics endpoints
  systemMetrics: {
    getAll: async (): Promise<ApiResponse<SystemMetric[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.systemMetrics.getAll();
      }

      try {
        const { data, error } = await supabase
          .from('system_metrics')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) throw error;

        return {
          success: true,
          data: data.map(item => ({
            id: Number(item.id), // Convert string to number
            timestamp: item.timestamp,
            cpu_usage: item.cpu_usage,
            memory_usage: item.ram_usage || 0, // Handle different column name
            disk_usage: 0, // Default value if not in real data
            network_traffic: (item.network_in || 0) + (item.network_out || 0),
            api_requests: 0, // Default value if not in real data
            status: item.cpu_usage > 80 ? 'critical' : item.cpu_usage > 60 ? 'warning' : 'healthy'
          }))
        };
      } catch (error) {
        console.error('Error fetching system metrics:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    
    getLatest: async (): Promise<ApiResponse<SystemMetric>> => {
      if (!USE_REAL_API) {
        return mockApiService.systemMetrics.getLatest();
      }

      try {
        const { data, error } = await supabase
          .from('system_metrics')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        return {
          success: true,
          data: {
            id: Number(data.id), // Convert string to number
            timestamp: data.timestamp,
            cpu_usage: data.cpu_usage,
            memory_usage: data.ram_usage || 0,
            disk_usage: 0,
            network_traffic: (data.network_in || 0) + (data.network_out || 0),
            api_requests: 0,
            status: data.cpu_usage > 80 ? 'critical' : data.cpu_usage > 60 ? 'warning' : 'healthy'
          }
        };
      } catch (error) {
        console.error('Error fetching latest system metric:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  // Risk assessment endpoints
  riskAssessments: {
    getAll: async (): Promise<ApiResponse<RiskAssessment[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.riskAssessments.getAll();
      }

      try {
        const { data, error } = await supabase
          .from('risk_assessments')
          .select('*, locations(name)')
          .order('assessment_date', { ascending: false });

        if (error) throw error;

        return {
          success: true,
          data: data.map(item => ({
            id: item.id,
            region: item.locations?.name || `Region ${item.location_id}`,
            risk_level: item.risk_level.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
            assessment_date: item.assessment_date,
            mitigation_measures: item.mitigation_measures || [],
            details: {
              environmental_factors: Object.entries(item.factors || {})
                .map(([key, value]) => `${key}: ${value}`),
              population_density: 0, // Default if not available
              historical_data: "Historical data not available in live system"
            }
          }))
        };
      } catch (error) {
        console.error('Error fetching risk assessments:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    
    getLatest: async (): Promise<ApiResponse<RiskAssessment[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.riskAssessments.getLatest();
      }

      try {
        const { data, error } = await supabase
          .from('risk_assessments')
          .select('*, locations(name)')
          .order('assessment_date', { ascending: false })
          .limit(3);

        if (error) throw error;

        return {
          success: true,
          data: data.map(item => ({
            id: item.id,
            region: item.locations?.name || `Region ${item.location_id}`,
            risk_level: item.risk_level.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH',
            assessment_date: item.assessment_date,
            mitigation_measures: item.mitigation_measures || [],
            details: {
              environmental_factors: Object.entries(item.factors || {})
                .map(([key, value]) => `${key}: ${value}`),
              population_density: 0,
              historical_data: "Historical data not available in live system"
            }
          }))
        };
      } catch (error) {
        console.error('Error fetching latest risk assessments:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  // Training metrics endpoints
  trainingMetrics: {
    getAll: async (): Promise<ApiResponse<TrainingMetric[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.trainingMetrics.getAll();
      }

      try {
        const response = await fetch(`${process.env.VITE_API_BASE_URL || ''}/api/training-metrics`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return {
          success: true,
          data: data.map((item: any) => ({
            id: Number(item.id),
            epoch: Number(item.epoch),
            accuracy: Number(item.accuracy),
            loss: Number(item.loss),
            val_accuracy: Number(item.val_accuracy),
            val_loss: Number(item.val_loss),
            timestamp: item.timestamp
          }))
        };
      } catch (error) {
        console.error('Error fetching training metrics:', error);
        return mockApiService.trainingMetrics.getAll(); // Fallback to mock as last resort
      }
    },
    
    getLatest: async (): Promise<ApiResponse<TrainingMetric>> => {
      if (!USE_REAL_API) {
        return mockApiService.trainingMetrics.getLatest();
      }

      try {
        const response = await fetch(`${process.env.VITE_API_BASE_URL || ''}/api/training-metrics/latest`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();

        return {
          success: true,
          data: {
            id: Number(data.id),
            epoch: Number(data.epoch),
            accuracy: Number(data.accuracy),
            loss: Number(data.loss),
            val_accuracy: Number(data.val_accuracy),
            val_loss: Number(data.val_loss),
            timestamp: data.timestamp
          }
        };
      } catch (error) {
        console.error('Error fetching latest training metric:', error);
        return mockApiService.trainingMetrics.getLatest(); // Fallback to mock
      }
    }
  },
  
  // AI logs endpoints
  aiLogs: {
    getAll: async (): Promise<ApiResponse<AILog[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.aiLogs.getAll();
      }

      try {
        const { data, error } = await supabase
          .from('ai_logs')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) throw error;

        return {
          success: true,
          data: data.map(item => ({
            id: Number(typeof item.id === 'number' ? item.id : 1),
            model: "deepseek-coder-v0.2", // Default model since it's not in the database
            prompt: item.prompt,
            response: typeof item.response === 'string' ? item.response : JSON.stringify(item.response),
            timestamp: item.timestamp,
            tokens_used: 0, // Default since it's not in the database
            latency_ms: item.processing_time ? item.processing_time * 1000 : 0
          }))
        };
      } catch (error) {
        console.error('Error fetching AI logs:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  },
  
  // Wind data endpoint
  wind: {
    getData: async (): Promise<ApiResponse<WindDataPoint[]>> => {
      if (!USE_REAL_API) {
        return mockApiService.wind.getData();
      }

      try {
        // In a real scenario, this could be fetching from a weather API or service
        const response = await fetch(`${process.env.VITE_API_BASE_URL || ''}/api/wind-data`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch wind data: ${response.statusText}`);
        }
        
        const data = await response.json();

        return {
          success: true,
          data: data.map((item: any) => ({
            id: item.id || `wind-${Math.random().toString(36).substring(7)}`,
            coordinates: item.coordinates || [item.longitude, item.latitude],
            u: item.u || (Math.random() * 10) - 5,
            v: item.v || (Math.random() * 10) - 5,
            speed: item.speed || Math.sqrt(item.u * item.u + item.v * item.v),
            direction: item.direction || Math.atan2(item.v, item.u) * (180 / Math.PI),
            timestamp: item.timestamp || new Date().toISOString(),
            position: {
              longitude: item.longitude || item.coordinates?.[0] || 0,
              latitude: item.latitude || item.coordinates?.[1] || 0,
              altitude: item.altitude || 0
            },
            weather: item.weather || 'clear'
          }))
        };
      } catch (error) {
        console.error('Error fetching wind data:', error);
        return mockApiService.wind.getData(); // Fallback to mock data
      }
    }
  },
  
  // Map data services
  mapData: {
    getLocations: async () => {
      if (!USE_REAL_API) {
        return mockApiService.mapData.getLocations();
      }

      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) throw error;

        return data.map(location => ({
          id: location.id,
          name: location.name,
          coordinates: [location.longitude, location.latitude],
          riskLevel: location.risk_level || 'low'
        }));
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to Flask API
        try {
          const response = await fetch(`${process.env.VITE_API_BASE_URL || ''}/api/locations`);
          if (!response.ok) throw new Error(response.statusText);
          return await response.json();
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
          return mockApiService.mapData.getLocations(); // Fallback to mock as last resort
        }
      }
    },
    
    getAlerts: async () => {
      if (!USE_REAL_API) {
        return mockApiService.mapData.getAlerts();
      }

      try {
        const { data, error } = await supabase
          .from('risk_assessments')
          .select('*, locations(name, longitude, latitude)')
          .eq('risk_level', 'high');

        if (error) throw error;

        return data.map(alert => ({
          id: alert.id,
          location: alert.locations?.name || `Location ${alert.location_id}`,
          coordinates: [
            alert.locations?.longitude || 0, 
            alert.locations?.latitude || 0
          ],
          riskLevel: 'high',
          timestamp: alert.assessment_date
        }));
      } catch (error) {
        console.error('Error fetching alerts:', error);
        return mockApiService.mapData.getAlerts(); // Fallback to mock
      }
    }
  }
};

// DeepSeek AI client
export const deepSeekClient = {
  analyze: async (prompt: string): Promise<ApiResponse<string>> => {
    if (!USE_REAL_API) {
      return mockDeepSeekClient.analyze(prompt);
    }

    try {
      const response = await supabase.functions.invoke('deepseek-process', {
        body: { prompt }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return {
        success: true,
        data: response.data?.result || response.data?.response || 'No response data'
      };
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      
      // Try fallback to Flask API
      try {
        const fallbackResponse = await fetch(`${process.env.VITE_API_BASE_URL || ''}/api/deepseek`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API error: ${fallbackResponse.statusText}`);
        }
        
        const data = await fallbackResponse.json();
        return {
          success: true,
          data: data.response || data.result || 'Fallback response'
        };
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        return mockDeepSeekClient.analyze(prompt); // Fallback to mock as last resort
      }
    }
  }
};

// WebSocket for real-time updates
export class RealtimeService {
  private socket: WebSocket | null = null;
  private listeners: { [key: string]: ((data: any) => void)[] } = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private url: string;

  constructor(url?: string) {
    // Use mock socket URL by default when not in real API mode
    this.url = USE_REAL_API
      ? (url || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`)
      : 'ws://mock-websocket-url';
  }

  connect() {
    if (!USE_REAL_API) {
      console.log('Using mock WebSocket (not actually connecting)');
      this.simulateMockData();
      return;
    }

    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type && this.listeners[data.type]) {
            this.listeners[data.type].forEach(listener => listener(data.payload));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnect attempts reached. Using mock data instead.');
      this.simulateMockData();
    }
  }

  private simulateMockData() {
    // Simulate WebSocket data for development purposes
    if (this.listeners['wind-update']) {
      setInterval(() => {
        mockApiService.wind.getData().then(response => {
          if (response.success && this.listeners['wind-update']) {
            this.listeners['wind-update'].forEach(listener => listener(response.data));
          }
        });
      }, 5000);
    }
    
    if (this.listeners['training-update']) {
      setInterval(() => {
        mockApiService.trainingMetrics.getLatest().then(response => {
          if (response.success && this.listeners['training-update']) {
            this.listeners['training-update'].forEach(listener => listener(response.data));
          }
        });
      }, 10000);
    }
    
    if (this.listeners['risk-assessment']) {
      setInterval(() => {
        mockApiService.riskAssessments.getLatest().then(response => {
          if (response.success && this.listeners['risk-assessment']) {
            this.listeners['risk-assessment'].forEach(listener => listener(response.data));
          }
        });
      }, 15000);
    }
  }

  subscribe(type: string, callback: (data: any) => void) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
    
    return () => {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
    };
  }

  send(type: string, payload: any) {
    if (!USE_REAL_API) {
      console.log('Mock WebSocket send:', { type, payload });
      return;
    }
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.error('WebSocket not connected, cannot send message');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Create a singleton instance of the RealtimeService
export const realtimeService = new RealtimeService();

// Helper function to initialize real-time services
export const initializeRealtimeServices = () => {
  realtimeService.connect();
};
