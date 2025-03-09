
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { CesiumMapWithData } from "./components/CesiumMapWithData";
import { WeatherMetrics } from "./components/WeatherMetrics";
import { ConversationBox } from "./components/ConversationBox";
import { RiskAssessmentPanel } from "./components/training/RiskAssessmentPanel";
import { initializeRealtimeServices } from "./services/apiService";
import { Toaster } from "./components/ui/toaster";
import FuturisticHUD from "./components/FuturisticHUD";
import FuturisticMapOverlay from "./components/FuturisticMapOverlay";
import "./styles/mapAnimations.css";

function App() {
  const weatherMetrics = [
    { type: "rain", value: 25, unit: "mm" },
    { type: "wind", value: 15, unit: "km/h" },
    { type: "clear", value: 28, unit: "°C" }
  ];

  // Add mock news items
  const newsItems = [
    "High risk detected in Maiduguri region - Population density increasing",
    "Weather conditions in Lagos are favorable for population growth",
    "Port Harcourt monitoring station reports elevated activity",
    "New environmental data available for analyzed regions"
  ];

  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    windSpeed: 15,
    humidity: 65,
    precipitation: 25,
    alert: false
  });

  const [mapStats, setMapStats] = useState({
    riskLevel: 35,
    population: 1250,
    precipitationChance: 45,
    temperatureChange: 2
  });

  // Simulate changing weather data with error handling
  useEffect(() => {
    try {
      const interval = setInterval(() => {
        setWeatherData(prev => ({
          ...prev,
          temperature: Number((prev.temperature + (Math.random() * 2 - 1)).toFixed(1)),
          windSpeed: Math.max(0, Number((prev.windSpeed + (Math.random() * 2 - 1)).toFixed(1))),
          humidity: Math.min(100, Math.max(0, Math.round(prev.humidity + (Math.random() * 5 - 2.5)))),
          alert: Math.random() > 0.9 // 10% chance of alert
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error in weather simulation:", error);
    }
  }, []);

  const memoizedNewsItems = useMemo(() => newsItems, []);

  useEffect(() => {
    try {
      // Initialize real-time services
      const services = initializeRealtimeServices();
      services.startMonitoring();
      
      return () => {
        services.stopMonitoring();
      };
    } catch (error) {
      console.error("Failed to initialize services:", error);
    }
  }, []);
  
  return (
    <div className="w-full h-screen overflow-hidden relative bg-black">
      <CesiumMapWithData />
      
      <div className="absolute top-4 left-4 w-72">
        <RiskAssessmentPanel />
      </div>
      
      {/* Futuristic Weather HUD */}
      <FuturisticHUD data={weatherData} />
      
      {/* Map Overlay and News Ticker */}
      <FuturisticMapOverlay stats={mapStats} newsItems={memoizedNewsItems} />
      
      {/* Weather metrics */}
      <div className="w-full top-5 h-screen overflow-hidden">
        <WeatherMetrics metrics={weatherMetrics} />
      </div>    
      
      <ConversationBox />
      <Toaster />
    </div>
  );
}

export default App;
