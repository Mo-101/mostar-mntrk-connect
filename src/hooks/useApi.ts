
// Define the proper exports and functions for the useApi hook
import { supabase, USE_MOCK_DATA } from "@/integrations/supabase/client";
import { useState } from "react";

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
  }
};

// Custom hook for API access
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // General-purpose API call function
  const apiCall = async <T extends unknown>(
    callback: () => Promise<T>,
    errorMessage = "API call failed"
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await callback();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading, error, api };
};

// Also export the api object directly for simpler imports
export { api };
