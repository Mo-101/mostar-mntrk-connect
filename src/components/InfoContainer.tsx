
import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, USE_MOCK_DATA } from '@/integrations/supabase/client';
import { RiskAssessment } from '@/types/api';
import { toast } from 'sonner';

const REFRESH_INTERVAL = 5000; // 5 seconds

interface InfoContainerProps {
  className?: string;
}

export function InfoContainer({ className }: InfoContainerProps) {
  const [alerts, setAlerts] = useState<RiskAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!USE_MOCK_DATA) {
          // Fetch real data from Supabase
          const { data, error } = await supabase
            .from('risk_assessments')
            .select('*')
            .order('assessment_date', { ascending: false })
            .limit(3);
            
          if (error) {
            throw new Error(error.message);
          }
          
          if (data) {
            setAlerts(data);
          }
        } else {
          // Mock data
          const mockAlerts: RiskAssessment[] = [
            {
              id: 1,
              region: "Maiduguri",
              risk_level: "HIGH",
              assessment_date: new Date().toISOString(),
              mitigation_measures: [
                "Increase surveillance in affected areas",
                "Deploy rapid response teams",
                "Distribute preventive medications"
              ],
              details: {
                environmental_factors: ["Rising temperatures", "High humidity"],
                population_density: 832,
                historical_data: "Previous outbreaks recorded in similar conditions"
              }
            },
            {
              id: 2,
              region: "Lagos",
              risk_level: "MEDIUM",
              assessment_date: new Date(Date.now() - 3600000).toISOString(),
              mitigation_measures: ["Monitor population growth", "Prepare response teams"],
              details: {
                environmental_factors: ["Moderate rainfall", "Urban density"],
                population_density: 1265,
                historical_data: "Moderate risk patterns identified"
              }
            },
            {
              id: 3,
              region: "Sokoto",
              risk_level: "LOW",
              assessment_date: new Date(Date.now() - 7200000).toISOString(),
              mitigation_measures: ["Routine monitoring", "Community education"],
              details: {
                environmental_factors: ["Normal conditions"],
                population_density: 325,
                historical_data: "No significant historical patterns"
              }
            }
          ];
          
          setAlerts(mockAlerts);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        toast.error("Failed to fetch alerts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    
    // Set up the refresh interval
    const interval = setInterval(fetchAlerts, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH':
        return (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </motion.div>
        );
      case 'MEDIUM':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  return (
    <div className={`fixed right-4 bottom-20 z-50 w-80 max-h-96 overflow-hidden ${className}`}>
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
        <h3 className="text-white text-sm font-medium mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
          Alert System
        </h3>
        
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, index) => (
              <motion.div 
                key={`${alert.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`mb-2 p-2 rounded-md bg-gray-900/70 border ${
                  alert.risk_level === 'HIGH' 
                    ? 'border-red-500/50' 
                    : alert.risk_level === 'MEDIUM' 
                      ? 'border-amber-500/50' 
                      : 'border-blue-500/50'
                }`}
              >
                <div className="flex items-start">
                  {getAlertIcon(alert.risk_level as string)}
                  <div className="ml-2 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-semibold text-sm">{alert.region}</p>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        alert.risk_level === 'HIGH' 
                          ? 'bg-red-500/20 text-red-500' 
                          : alert.risk_level === 'MEDIUM' 
                            ? 'bg-amber-500/20 text-amber-500' 
                            : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {alert.risk_level}
                      </span>
                    </div>
                    {alert.mitigation_measures && alert.mitigation_measures.length > 0 && (
                      <p className="text-gray-300 text-xs mt-1">{alert.mitigation_measures[0]}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
