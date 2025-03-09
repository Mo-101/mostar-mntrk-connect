
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { TrainingMetric } from '@/types/api';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrainingProgress } from './TrainingProgress';
import { ConnectionStatus } from './ConnectionStatus';
import { TrainingActions } from './TrainingActions';

export function TrainingControls() {
  const { apiCall, api, realtime } = useApi();
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(50);
  const [accuracy, setAccuracy] = useState(0);
  const [loss, setLoss] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('training_metrics').select('count').limit(1);
        if (!error) {
          setIsConnected(true);
          console.log("Successfully connected to Supabase");
        } else {
          console.error("Supabase connection error:", error);
          setIsConnected(false);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setIsConnected(false);
      }
    };
    
    checkSupabaseConnection();
    
    const fetchTrainingMetrics = async () => {
      try {
        // Try to get metrics from Supabase
        if (isConnected) {
          const { data, error } = await supabase
            .from('training_metrics')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!error && data && data.length > 0) {
            setCurrentEpoch(data[0].epoch);
            setAccuracy(data[0].accuracy * 100);
            setLoss(data[0].loss);
            return;
          }
        }
        
        // Fallback to API if Supabase fails
        const latestMetric = await apiCall<TrainingMetric>(
          () => api.trainingMetrics?.getLatest() || 
                Promise.resolve({ success: false, error: 'API not available' })
        );
        
        if (latestMetric) {
          setCurrentEpoch(latestMetric.epoch);
          setAccuracy(latestMetric.accuracy * 100);
          setLoss(latestMetric.loss);
        }
      } catch (error) {
        console.error("Error fetching training metrics:", error);
      }
    };
    
    fetchTrainingMetrics();
    
    // Subscribe to real-time training updates
    let subscription;
    if (isConnected) {
      subscription = supabase
        .channel('public:training_metrics')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'training_metrics' 
        }, (payload) => {
          const data = payload.new;
          setCurrentEpoch(data.epoch || 0);
          setAccuracy((data.accuracy || 0) * 100);
          setLoss(data.loss || 0);
        })
        .subscribe();
    } else {
      // Fallback to mock real-time
      const unsubscribe = realtime.subscribe('training-update', (data) => {
        if (data) {
          setCurrentEpoch(data.epoch || 0);
          setAccuracy((data.accuracy || 0) * 100);
          setLoss(data.loss || 0);
        }
      });
      
      return () => {
        unsubscribe();
      };
    }
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [isConnected]);
  
  // Start training - connect to Supabase or fallback to API
  const handleStartTraining = async () => {
    setIsTraining(true);
    
    try {
      if (isConnected) {
        // Record training start in Supabase
        const { error } = await supabase
          .from('training_sessions')
          .insert({
            status: 'running',
            started_at: new Date().toISOString(),
            target_epochs: totalEpochs
          });
          
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success("Training started and connected to Supabase");
      } else {
        // Fallback to API or WebSocket
        realtime.send('training-command', { action: 'start' });
        
        // Simulate training progress in mock mode
        if (!api) {
          toast.info("Using mock training data (Supabase connection unavailable)");
          let epoch = currentEpoch;
          const interval = setInterval(() => {
            epoch += 1;
            if (epoch > totalEpochs) {
              clearInterval(interval);
              setIsTraining(false);
              return;
            }
            
            setCurrentEpoch(epoch);
            // Generate realistic training metrics
            const newAccuracy = Math.min(0.5 + (epoch / totalEpochs) * 0.45, 0.95) + (Math.random() * 0.05);
            const newLoss = Math.max(0.5 - (epoch / totalEpochs) * 0.45, 0.05) + (Math.random() * 0.05);
            setAccuracy(newAccuracy * 100);
            setLoss(newLoss);
            
            // Store mock data in session storage for persistence
            sessionStorage.setItem('training_progress', JSON.stringify({
              epoch,
              accuracy: newAccuracy,
              loss: newLoss
            }));
          }, 1000);
          
          return () => clearInterval(interval);
        }
      }
    } catch (error) {
      console.error("Error starting training:", error);
      toast.error("Failed to start training");
      setIsTraining(false);
    }
  };
  
  // Pause training
  const handlePauseTraining = async () => {
    setIsTraining(false);
    
    try {
      if (isConnected) {
        // Record training pause in Supabase
        const { error } = await supabase
          .from('training_sessions')
          .update({
            status: 'paused',
            paused_at: new Date().toISOString()
          })
          .eq('status', 'running');
          
        if (error) {
          throw new Error(error.message);
        }
        
        toast.info("Training paused");
      } else {
        // Fallback to WebSocket
        realtime.send('training-command', { action: 'pause' });
      }
    } catch (error) {
      console.error("Error pausing training:", error);
      toast.error("Failed to pause training");
    }
  };
  
  // Reset training
  const handleResetTraining = async () => {
    setIsTraining(false);
    setCurrentEpoch(0);
    setAccuracy(0);
    setLoss(0);
    
    try {
      if (isConnected) {
        // Record training reset in Supabase
        const { error } = await supabase
          .from('training_sessions')
          .update({
            status: 'reset',
            completed_at: new Date().toISOString()
          })
          .in('status', ['running', 'paused']);
          
        if (error) {
          throw new Error(error.message);
        }
        
        toast.success("Training reset");
      } else {
        // Fallback to WebSocket
        realtime.send('training-command', { action: 'reset' });
        // Clear session storage
        sessionStorage.removeItem('training_progress');
      }
    } catch (error) {
      console.error("Error resetting training:", error);
      toast.error("Failed to reset training");
    }
  };
  
  return (
    <div className="p-4 bg-[#1C2333] rounded-md">
      <h3 className="text-sm font-medium text-gray-200 mb-4">Training Controls</h3>
      
      <TrainingProgress 
        currentEpoch={currentEpoch}
        totalEpochs={totalEpochs}
        accuracy={accuracy}
        loss={loss}
      />
      
      <ConnectionStatus isConnected={isConnected} />
      
      <TrainingActions
        isTraining={isTraining}
        onStartTraining={handleStartTraining}
        onPauseTraining={handlePauseTraining}
        onResetTraining={handleResetTraining}
      />
    </div>
  );
}
