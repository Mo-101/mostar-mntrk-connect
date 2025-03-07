
import { useState } from 'react';
import { mockApiService, mockDeepSeekClient } from '@/utils/mockApiService';
import { fetchMapLocations, fetchMapAlerts } from '@/utils/mapUtils';
import { ApiResponse } from '@/types/api';

// Hook for accessing mock API services
export const useMockApi = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // DeepSeek AI client
  const deepSeek = {
    analyze: async (prompt: string) => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await mockDeepSeekClient.analyze(prompt);
        return response.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Map data services
  const mapData = {
    getLocations: async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchMapLocations();
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    
    getAlerts: async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetchMapAlerts();
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    api: mockApiService,
    deepSeek,
    mapData,
    apiCall,
    isLoading,
    error
  };
};
