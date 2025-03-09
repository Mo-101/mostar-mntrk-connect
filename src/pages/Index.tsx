
import { CesiumMapWithData } from "@/components/CesiumMapWithData";
import { WeatherMetrics } from "@/components/WeatherMetrics";
import { ConversationBox } from "@/components/ConversationBox";
import { RiskAssessmentPanel } from "@/components/training/RiskAssessmentPanel";
import { useEffect, useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { initializeRealtimeServices } from "@/services/apiService";
import "../styles/mapAnimations.css";

const Index = () => {
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

  const memoizedNewsItems = useMemo(() => newsItems, []);

  useEffect(() => {
    // Initialize real-time services
    initializeRealtimeServices();
    
    // Simulate news scrolling
    let currentIndex = 0;
    const interval = setInterval(() => {
      const newsElement = document.getElementById('news-ticker');
      if(newsElement){
        newsElement.textContent = memoizedNewsItems[currentIndex];
        currentIndex = (currentIndex + 1) % memoizedNewsItems.length;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [memoizedNewsItems]);
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <CesiumMapWithData />
      
      <div className="absolute top-4 left-4 w-72">
        <RiskAssessmentPanel />
      </div>
      
      {/* Weather metrics */}
      <div className="w-full top-5 h-screen overflow-hidden">
          <WeatherMetrics metrics={weatherMetrics} />
      </div>    
      
      {/* News ticker at bottom */}
      <div className="fixed bottom-15 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-gray-800 z-50">
        <div className="container mx-auto py-2 px-4 flex items-center">
          <div className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-medium mr-3">
            ALERT
          </div>
          <div id="news-ticker" className="text-sm text-gray-200 transition-all duration-1000">
            {newsItems[0]}
          </div>
        </div>
      </div>
      
      <ConversationBox />
      <Toaster />
    </div>
  );
};

export default Index;
