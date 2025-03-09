import { useState, useEffect } from 'react';
import { ArrowUpRightSquare, AlertCircle, Zap, Loader } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { DeepSeekAnalysis } from '@/types/api';

export function DeepSeekInsights() {
  const { deepSeek } = useApi();
  const [insights, setInsights] = useState<DeepSeekAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoAnalysisEnabled, setAutoAnalysisEnabled] = useState(true);

  // Prompts for auto-analysis
  const autoAnalysisPrompts = [
    "Analyze the current environmental data and population density across monitoring regions.",
    "Examine recent movement patterns and assess the risk of population spread.",
    "Evaluate the effectiveness of current monitoring strategies based on detection data.",
    "Based on seasonal changes, predict migration patterns for the next 30 days.",
    "Identify high-risk zones based on environmental conditions and historical data."
  ];

  // Function to perform automatic analysis
  const performAutoAnalysis = async () => {
    if (!autoAnalysisEnabled) return;
    
    setIsLoading(true);
    try {
      // Select a random prompt for analysis
      const randomIndex = Math.floor(Math.random() * autoAnalysisPrompts.length);
      const prompt = autoAnalysisPrompts[randomIndex];
      
      // Call DeepSeek API
      const result = await deepSeek.analyze(prompt, false); // false = use mock data
      
      if (result) {
        // Add to insights list
        setInsights(prev => {
          // Keep only the 5 most recent insights
          const updated = [result, ...prev];
          return updated.slice(0, 5);
        });
      }
    } catch (error) {
      console.error("Auto-analysis error:", error);
      toast.error("Failed to perform automatic analysis");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with auto analysis
  useEffect(() => {
    performAutoAnalysis();
    
    // Set up interval for auto analysis
    const interval = setInterval(() => {
      performAutoAnalysis();
    }, 60000); // Run every minute
    
    return () => clearInterval(interval);
  }, [autoAnalysisEnabled]);

  // Get appropriate styling based on risk level
  const getRiskLevelStyle = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-500/20 text-red-500';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-500';
      default:
        return 'bg-green-500/20 text-green-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-300 flex items-center">
          <Zap className="w-4 h-4 mr-1" />
          DeepSeek Insights
        </div>
        {isLoading && (
          <div className="text-xs text-gray-400 flex items-center">
            <Loader className="w-3 h-3 mr-1 animate-spin" />
            Analyzing...
          </div>
        )}
      </div>

      {insights.length === 0 ? (
        <div className="bg-[#1C2333] p-4 rounded-md text-gray-400 text-sm">
          No insights available yet. Automatic analysis will run shortly.
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="bg-[#1C2333] p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className={`text-xs font-medium px-2 py-0.5 rounded ${getRiskLevelStyle(insight.metadata.risk_level)}`}>
                  {insight.metadata.category.replace('_', ' ').toUpperCase()}
                </div>
                <div className="text-xs text-gray-400">
                  Confidence: {(insight.metadata.confidence * 100).toFixed(0)}%
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-2">{insight.response}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <div>
                  Regions: {insight.metadata.regions_affected.join(', ')}
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {insight.metadata.risk_level} RISK
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={performAutoAnalysis}
        disabled={isLoading}
        className="w-full flex items-center justify-center text-xs bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
      >
        <ArrowUpRightSquare className="w-3 h-3 mr-1" />
        Request New Analysis
      </button>
    </div>
  );
}
