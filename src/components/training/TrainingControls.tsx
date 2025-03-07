
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { TrainingMetric } from '@/types/api';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{currentEpoch} / {totalEpochs} epochs</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentEpoch / totalEpochs) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#262E45] p-3 rounded-md">
          <div className="text-xs text-gray-400 mb-1">Accuracy</div>
          <div className="text-lg font-bold text-gray-200">{accuracy.toFixed(2)}%</div>
        </div>
        <div className="bg-[#262E45] p-3 rounded-md">
          <div className="text-xs text-gray-400 mb-1">Loss</div>
          <div className="text-lg font-bold text-gray-200">{loss.toFixed(4)}</div>
        </div>
      </div>
      
      {/* Connection status indicator */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-gray-400">Database Connection:</span>
        <span className={`text-xs font-medium ${isConnected ? 'text-green-500' : 'text-amber-500'}`}>
          {isConnected ? 'Connected to Supabase' : 'Using Mock Data'}
        </span>
      </div>
      
      <div className="flex space-x-2">
        {!isTraining ? (
          <button 
            onClick={handleStartTraining}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Training
          </button>
        ) : (
          <button 
            onClick={handlePauseTraining}
            className="flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </button>
        )}
        
        <button 
          onClick={handleResetTraining}
          className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <button className="mt-4 w-full flex items-center justify-between text-xs bg-[#262E45] hover:bg-[#303A57] text-gray-300 p-2 rounded transition-colors">
        <span>View Detailed Training Metrics</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
