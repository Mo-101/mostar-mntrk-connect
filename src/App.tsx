import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { CesiumMapWithData } from "./components/CesiumMapWithData";
import { WeatherMetrics } from "./components/WeatherMetrics";
import { ConversationBox } from "./components/ConversationBox";
import { RiskAssessmentPanel } from "./components/training/RiskAssessmentPanel";
import { initializeRealtimeServices, fetchWeatherData, analyzeRiskLevels } from "./services/apiService";
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

  useEffect(() => {
    try {
      const interval = setInterval(async () => {
        const weatherResponse = await fetchWeatherData({ lat: 6.5244, lng: 3.3792 });
        
        if (weatherResponse.success && weatherResponse.data) {
          setWeatherData(prev => ({
            ...prev,
            temperature: Number(weatherResponse.data.temperature.toFixed(1)),
            windSpeed: Math.max(0, Number(weatherResponse.data.windSpeed.toFixed(1))),
            humidity: Math.min(100, Math.max(0, Math.round(weatherResponse.data.humidity))),
            alert: weatherResponse.data.alert,
            alertMessage: weatherResponse.data.alertMessage
          }));
          
          const locationData = { population: 1250 + Math.random() * 500 };
          const riskResponse = analyzeRiskLevels(weatherResponse.data, locationData);
          
          if (riskResponse.success && riskResponse.data) {
            setMapStats(prev => ({
              ...prev,
              riskLevel: riskResponse.data.riskLevel,
              population: Math.round(locationData.population),
              precipitationChance: Math.round(weatherResponse.data.precipitation),
              temperatureChange: Number((Math.random() * 4 - 2).toFixed(1))
            }));
          }
        }
      }, 5000);
      
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error in weather simulation:", error);
    }
  }, []);

  const memoizedNewsItems = useMemo(() => newsItems, []);

  useEffect(() => {
    try {
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
      
      <FuturisticHUD data={weatherData} />
      
      <FuturisticMapOverlay stats={mapStats} newsItems={memoizedNewsItems} />
      
      <div className="w-full top-5 h-screen overflow-hidden">
        <WeatherMetrics metrics={weatherMetrics} />
      </div>    
      
      <ConversationBox />
      <Toaster />
    </div>
  );
}

export default App;
