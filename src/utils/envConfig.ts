
/**
 * Environment Configuration Utility
 * 
 * This utility centralizes access to environment variables across the application
 * to avoid duplication and inconsistencies.
 */

// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://fdezrtfnjsweyoborhwg.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXpydGZuanN3ZXlvYm9yaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwOTkwMzAsImV4cCI6MjA0ODY3NTAzMH0.Eaqr65G0feAYC0y4aWD_9HoGDRdrTCuXYuNgLoAQ9-c',
  serviceRoleKey: import.meta.env.VITE_SUPABASE_SECRET_ROLE
}

// OpenAI/DeepSeek configuration
export const aiConfig = {
  openAiKey: import.meta.env.VITE_OPENAI_KEY,
  deepSeekUrl: import.meta.env.DEEPSEEK_API_URL || 'http://127.0.0.1:1234/v1/completions',
  deepSeekModel: import.meta.env.DEEPSEEK_MODEL || 'deepseek-r1-distill-qwen-7b'
}

// Weather API configuration
export const weatherConfig = {
  openWeatherApiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '32b25b6e6eb45b6df18d92b934c332a7'
}

// Cesium configuration
export const cesiumConfig = {
  accessToken: import.meta.env.VITE_CESIUM_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMmRmYzcxNC0yZjM5LTQ0NzUtYWRkYi1kMjc1NzYwYTQ0NjYiLCJpZCI6MjE0OTQzLCJpYXQiOjE3MTU2NTMyNjN9.1fW--_-6R3TApPF2tAlOfXrqJadYPdwKqpPVkPetHP4'
}

// API configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '',
  timeout: parseInt(import.meta.env.API_TIMEOUT || '10000', 10),
  cacheTtl: parseInt(import.meta.env.CACHE_TTL || '3600', 10)
}

/**
 * Get a configured value with fallback
 * @param key The environment variable key
 * @param defaultValue The default value if not found
 */
export function getEnvValue(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue;
}
