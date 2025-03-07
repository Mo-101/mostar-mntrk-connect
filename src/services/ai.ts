
import { supabase } from "@/integrations/supabase/client";
import { aiConfig } from "@/utils/envConfig";

/**
 * AI Service that provides chat and analysis capabilities
 * using Supabase Edge Functions or direct API calls
 */
export const aiService = {
  /**
   * Send a chat message to the AI for processing
   * @param message The user message to process
   * @param type The type of processing to perform
   */
  chat: async (message: string, type: 'analysis' | 'prediction' | 'general' = 'general') => {
    try {
      console.log('Sending chat request:', { message, type });
      
      // First try using Supabase Edge Function
      try {
        const response = await supabase.functions.invoke('deepseek-process', {
          body: { query: message, type }
        });

        console.log('Raw response from edge function:', response);

        if (response.error) {
          console.error('Edge function error:', response.error);
          throw new Error(response.error.message || 'Error from edge function');
        }

        if (!response.data || !response.data.result) {
          console.error('Invalid response format:', response.data);
          throw new Error('Invalid response received from the chat function');
        }

        console.log('Successfully received chat response:', response.data.result);
        return response.data.result;
      } catch (edgeFunctionError) {
        console.warn('Edge function failed, falling back to API:', edgeFunctionError);
        
        // Fall back to direct API call if edge function fails
        const apiResponse = await fetch(`${aiConfig.deepSeekUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: aiConfig.deepSeekModel,
            prompt: message,
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        
        if (!apiResponse.ok) {
          throw new Error(`API request failed: ${apiResponse.statusText}`);
        }
        
        const data = await apiResponse.json();
        return data.choices?.[0]?.text || 'No response from AI service';
      }
      
    } catch (error) {
      console.error('Error in AI service:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to reach the AI service. Please check your connection.');
      } else if (error.message?.includes('429')) {
        throw new Error('The AI service is experiencing high demand. Please try again in a few moments.');
      } else if (error.message?.includes('401')) {
        throw new Error('Authentication error with AI service. Please check API key configuration.');
      }
      
      throw new Error(error.message || 'An unexpected error occurred while processing your request');
    }
  }
};
