
import { useState, useEffect } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudSun, CloudLightning, Sun, Wind, Droplets, Thermometer } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { OPENWEATHER_API_KEY, USE_MOCK_DATA } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  location: string;
}

interface WeatherInfoProps {
  className?: string;
}

export function WeatherInfo({ className }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch real weather data from OpenWeather API
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      if (OPENWEATHER_API_KEY && !USE_MOCK_DATA) {
        // Get real data from OpenWeather (using Nigeria coordinates)
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=9.0820&lon=8.6753&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`OpenWeather API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          condition: data.weather[0].main,
          location: data.name
        });
      } else {
        // Use mock data
        generateMockWeatherData();
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      
      // Fall back to mock data on error
      generateMockWeatherData();
      
      if (!USE_MOCK_DATA) {
        toast.error('Failed to fetch weather data, using simulated data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to generate mock weather data
  const generateMockWeatherData = () => {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow'];
    const locations = ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Maiduguri'];
    
    setWeather({
      temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
      humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      location: locations[Math.floor(Math.random() * locations.length)]
    });
  };

  useEffect(() => {
    // Fetch weather data initially
    fetchWeatherData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchWeatherData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Get the appropriate weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-slate-300" />;
      case 'clouds':
        return <Cloud className="h-8 w-8 text-slate-500" />;
      case 'partly cloudy':
        return <CloudSun className="h-8 w-8 text-amber-500" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-indigo-500" />;
      case 'clear':
        return <Sun className="h-8 w-8 text-amber-400" />;
      default:
        return <Cloud className="h-8 w-8 text-slate-500" />;
    }
  };

  if (loading && !weather) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <Card className="p-4 bg-black/50 backdrop-blur-sm border border-gray-800">
          <div className="flex items-center justify-center h-28">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={weather?.condition || 'loading'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden bg-black/50 backdrop-blur-sm border border-gray-800">
            <div className="flex flex-col space-y-2 p-4">
              {/* Location and Time */}
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">{weather?.location}</h3>
                <span className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {/* Main Weather Display */}
              <div className="flex items-center space-x-4">
                {weather && getWeatherIcon(weather.condition)}
                <div>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-xl font-bold text-white">
                      {weather?.temperature}°C
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{weather?.condition}</p>
                </div>
              </div>
              
              {/* Additional Weather Info */}
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-300">
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1 text-blue-400" />
                  <span>{weather?.windSpeed} km/h</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="h-3 w-3 mr-1 text-blue-400" />
                  <span>{weather?.humidity}%</span>
                </div>
              </div>
              
              {/* Data Source Indicator */}
              <div className="mt-1 pt-1 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                <span>
                  {USE_MOCK_DATA ? 'Simulated data' : 'Live data'}
                </span>
                {loading && (
                  <span className="flex items-center">
                    <div className="animate-spin h-2 w-2 border border-gray-500 border-t-transparent rounded-full mr-1"></div>
                    Updating...
                  </span>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
