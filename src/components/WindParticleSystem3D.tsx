
import { useEffect, useRef, useState } from 'react';
import { Color, Cartesian3, ParticleSystem, Particle, CircleEmitter, Matrix4 } from 'cesium';
import { useApi } from "@/hooks/useApi";
import { WindDataPoint } from '@/types/api';
import { supabase, USE_MOCK_DATA, OPENWEATHER_API_KEY } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WindParticleSystem3DProps {
  viewer: any;
}

interface WeatherData {
  wind: {
    speed: number;
    deg: number;
  };
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

export function WindParticleSystem3D({ viewer }: WindParticleSystem3DProps) {
  const { api } = useApi();
  const windParticlesRef = useRef<any>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const updateTimerRef = useRef<number | null>(null);
  
  // Function to fetch weather data from OpenWeather API
  const fetchWeatherData = async () => {
    try {
      if (OPENWEATHER_API_KEY && !USE_MOCK_DATA) {
        // Fetch real data from OpenWeather
        // Using coordinates for Nigeria
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=9.0820&lon=8.6753&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeatherData(data);
        return data;
      } else {
        // Use mock data
        const mockWeatherData: WeatherData = {
          wind: {
            speed: 5.5 + Math.random() * 3, // 5.5 - 8.5 m/s
            deg: Math.random() * 360 // 0-360 degrees
          },
          main: {
            temp: 28 + Math.random() * 4, // 28-32 degrees
            humidity: 65 + Math.random() * 20 // 65-85%
          },
          weather: [
            {
              main: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
              description: 'Simulated weather data'
            }
          ]
        };
        setWeatherData(mockWeatherData);
        return mockWeatherData;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback to mock data on error
      const fallbackData: WeatherData = {
        wind: { speed: 6.7, deg: 220 },
        main: { temp: 30, humidity: 75 },
        weather: [{ main: 'Clear', description: 'Fallback weather data' }]
      };
      setWeatherData(fallbackData);
      return fallbackData;
    }
  };
  
  // Function to convert the weather data to the format needed for particles
  const convertToWindData = (weather: WeatherData): WindDataPoint[] => {
    // Create points around Nigeria for the wind simulation
    const baseCoordinates = [
      [8.6753, 9.0820], // Nigeria center
      [7.5, 8.5],       // Southwest
      [9.8, 9.5],       // Northeast
      [8.0, 10.2],      // Northwest
      [9.2, 8.0]        // Southeast
    ];
    
    return baseCoordinates.map((coords, index) => {
      // Vary speed and direction slightly around points for more natural effect
      const speedVariation = Math.random() * 1.5 - 0.75; // -0.75 to 0.75
      const degVariation = Math.random() * 30 - 15; // -15 to 15 degrees
      
      // Ensure coords is always a tuple of [number, number] to match WindDataPoint type
      const fixedCoords: [number, number] = [coords[0], coords[1]];
      
      return {
        id: `wind-${index}`,
        coordinates: fixedCoords,
        u: Math.sin((weather.wind.deg + degVariation) * Math.PI / 180) * 
           (weather.wind.speed + speedVariation),
        v: Math.cos((weather.wind.deg + degVariation) * Math.PI / 180) * 
           (weather.wind.speed + speedVariation),
        speed: weather.wind.speed + speedVariation,
        direction: weather.wind.deg + degVariation,
        timestamp: new Date().toISOString(),
        position: {
          longitude: coords[0],
          latitude: coords[1],
          altitude: 10000 + Math.random() * 5000 // Vary altitude
        },
        weather: weather.weather[0].main
      };
    });
  };
  
  useEffect(() => {
    if (!viewer) {
      console.log("Viewer is not available for WindParticleSystem3D");
      return;
    }
    
    if (!viewer.scene) {
      console.log("Viewer scene is not available for WindParticleSystem3D");
      return;
    }
    
    const initializeParticleSystem = async () => {
      try {
        // First fetch weather data
        const weather = await fetchWeatherData();
        
        // Convert to wind data format
        let windData: WindDataPoint[];
        
        if (!USE_MOCK_DATA) {
          try {
            // Try to get real wind data from API first
            const response = await api.wind.getData();
            if (response.success && response.data) {
              windData = response.data;
            } else {
              // Fallback to converted weather data
              windData = convertToWindData(weather);
            }
          } catch (error) {
            console.error("Error fetching wind data:", error);
            windData = convertToWindData(weather);
          }
        } else {
          // Use mock data created from weather
          windData = convertToWindData(weather);
        }
        
        // Create particle system
        createParticleSystem(windData, weather);
        
        // Store wind data if needed
        if (!USE_MOCK_DATA) {
          try {
            // Use local storage or another method to cache wind data
            // instead of Supabase if the table doesn't exist
            localStorage.setItem('wind_data', JSON.stringify({ 
              data: windData,
              weather_data: weather,
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.error("Error saving wind data:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing particle system:", error);
        toast.error("Failed to initialize wind simulation");
      }
    };
    
    // Initialize the particle system
    initializeParticleSystem();
    
    // Set up update timer (every 30 seconds)
    updateTimerRef.current = window.setInterval(async () => {
      try {
        const weather = await fetchWeatherData();
        const windData = convertToWindData(weather);
        
        // Update existing particle system with new data
        if (windParticlesRef.current) {
          updateParticleSystem(windData, weather);
        } else {
          // Create a new system if it doesn't exist
          createParticleSystem(windData, weather);
        }
      } catch (error) {
        console.error("Error updating wind particle system:", error);
      }
    }, 30000);
    
    // Clean up on unmount
    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
      
      if (windParticlesRef.current) {
        viewer.scene.primitives.remove(windParticlesRef.current);
        windParticlesRef.current = null;
      }
    };
  }, [viewer, api]);
  
  // Function to create the particle system
  const createParticleSystem = (windData: WindDataPoint[], weather: WeatherData) => {
    if (!viewer || !viewer.scene || !windData.length) {
      console.log("Cannot create particle system: missing required elements");
      return;
    }
    
    // Remove existing particle system if any
    if (windParticlesRef.current) {
      try {
        viewer.scene.primitives.remove(windParticlesRef.current);
      } catch (error) {
        console.error("Error removing existing particle system:", error);
      }
    }
    
    // Get wind speed and adjust particle count based on it
    const windSpeed = weather.wind.speed;
    const particleCount = Math.min(5000, Math.max(1000, Math.floor(windSpeed * 300)));
    
    // Create a particle system for each wind data point
    try {
      windParticlesRef.current = [];
      
      windData.forEach((point, index) => {
        // Convert to Cesium coordinates
        const position = Cartesian3.fromDegrees(
          point.position.longitude, 
          point.position.latitude, 
          point.position.altitude
        );
        
        // Create particle system
        const particleSystem = new ParticleSystem({
          image: '/particle.png',
          startColor: getColorForWeather(weather.weather[0].main),
          endColor: new Color(1.0, 1.0, 1.0, 0.0),
          startScale: 1.5,
          endScale: 5.0,
          minimumParticleLife: 1.0,
          maximumParticleLife: 5.0,
          minimumSpeed: Math.max(1, windSpeed * 20),
          maximumSpeed: Math.max(5, windSpeed * 40),
          imageSize: new Cartesian3(15.0, 15.0, 15.0),
          emissionRate: particleCount / 5,
          lifetime: 16.0,
          emitter: new CircleEmitter(600.0),
          modelMatrix: Matrix4.fromTranslation(
            Cartesian3.fromDegrees(
              point.position.longitude,
              point.position.latitude,
              point.position.altitude
            )
          ),
          emitterModelMatrix: calculateEmitterMatrix(point.direction)
        });
        
        // Add to scene
        try {
          viewer.scene.primitives.add(particleSystem);
          windParticlesRef.current.push(particleSystem);
        } catch (error) {
          console.error("Error adding particle system to scene:", error);
        }
      });
    } catch (error) {
      console.error("Error creating particle systems:", error);
    }
  };
  
  // Function to update an existing particle system
  const updateParticleSystem = (windData: WindDataPoint[], weather: WeatherData) => {
    if (!viewer || !viewer.scene || !windData.length || !windParticlesRef.current) return;
    
    // Clean up old systems
    try {
      if (Array.isArray(windParticlesRef.current)) {
        windParticlesRef.current.forEach((system) => {
          viewer.scene.primitives.remove(system);
        });
      } else {
        viewer.scene.primitives.remove(windParticlesRef.current);
      }
      
      // Create new systems with updated data
      createParticleSystem(windData, weather);
    } catch (error) {
      console.error("Error updating particle system:", error);
    }
  };
  
  // Function to get color based on weather condition
  const getColorForWeather = (weatherType: string): Color => {
    switch (weatherType.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return new Color(0.5, 0.5, 0.9, 0.7); // Blue-ish
      case 'snow':
        return new Color(0.9, 0.9, 0.9, 0.7); // White
      case 'clouds':
        return new Color(0.7, 0.7, 0.7, 0.5); // Gray
      case 'clear':
        return new Color(0.9, 0.9, 0.7, 0.4); // Yellow-ish
      case 'thunderstorm':
        return new Color(0.6, 0.6, 0.8, 0.8); // Purple-ish
      default:
        return new Color(0.8, 0.8, 0.8, 0.6); // Default white-ish
    }
  };
  
  // Function to calculate emitter matrix based on wind direction
  const calculateEmitterMatrix = (windDirection: number) => {
    // Convert wind direction to radians
    const directionRadians = windDirection * Math.PI / 180;
    
    // Return undefined for identity matrix (default behavior)
    return undefined;
  };
  
  return null;
}
