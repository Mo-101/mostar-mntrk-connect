
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { analyzeRiskLevels, startModelTraining, stopTrainingSession } from '../../services/apiService';
import TrainingMetricsDisplay from './TrainingMetricsDisplay';

interface TrainingMetrics {
  epoch: number;
  accuracy: number;
  loss: number;
  val_accuracy: number;
  val_loss: number;
}

const TrainingController: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs, setTotalEpochs] = useState(50);
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [statusMessage, setStatusMessage] = useState('Training ready to begin');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Simulate cleanup when component unmounts
    return () => {
      if (isTraining) {
        console.log('Training stopped due to component unmount');
        if (sessionId) {
          stopTrainingSession(sessionId).catch(console.error);
        }
      }
    };
  }, [isTraining, sessionId]);

  const startTraining = async () => {
    try {
      setIsTraining(true);
      setStatusMessage('Initializing training environment...');
      toast.info('Training process initiated');
      
      // Reset metrics
      setMetrics([]);
      setProgress(0);
      setCurrentEpoch(0);
      
      // Start a training session
      const trainingResponse = await startModelTraining({ 
        epochs: totalEpochs, 
        learningRate: 0.001 
      });
      
      if (trainingResponse.success && trainingResponse.data) {
        setSessionId(trainingResponse.data.sessionId);
        toast.success(`Training session ${trainingResponse.data.sessionId} started`);
        
        // Start the training simulation
        simulateTrainingProcess();
      } else {
        throw new Error('Failed to initialize training');
      }
    } catch (error) {
      console.error('Error starting training:', error);
      setStatusMessage(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsTraining(false);
      toast.error('Training process failed to start');
    }
  };

  const stopTraining = async () => {
    try {
      if (sessionId) {
        await stopTrainingSession(sessionId);
      }
      setIsTraining(false);
      setStatusMessage('Training stopped manually');
      toast.info('Training process stopped');
    } catch (error) {
      console.error('Error stopping training:', error);
      toast.error('Failed to stop training process');
    }
  };

  const simulateTrainingProcess = () => {
    setStatusMessage('Training in progress...');
    
    // Use a more realistic approach with a recurring interval
    const trainingInterval = setInterval(() => {
      if (!isTraining) {
        clearInterval(trainingInterval);
        return;
      }
      
      setCurrentEpoch(prev => {
        const newEpoch = prev + 1;
        
        // Generate realistic training metrics that show learning progress
        const epochProgress = newEpoch / totalEpochs;
        
        // Add some randomness but ensure general improvement over time
        const fluctuation = Math.sin(newEpoch * 0.2) * 0.05;
        const improvementCurve = Math.sqrt(epochProgress);
        
        const newAccuracy = Math.min(0.5 + improvementCurve * 0.4 + fluctuation, 0.99);
        const newLoss = Math.max(0.5 - improvementCurve * 0.4 + fluctuation, 0.01);
        
        // Validation metrics trail slightly behind training metrics
        const validationLag = 0.05 + Math.random() * 0.1;
        const newValAccuracy = Math.max(0, newAccuracy - validationLag);
        const newValLoss = Math.min(1, newLoss + validationLag);
        
        const newMetric = {
          epoch: newEpoch,
          accuracy: parseFloat(newAccuracy.toFixed(4)),
          loss: parseFloat(newLoss.toFixed(4)),
          val_accuracy: parseFloat(newValAccuracy.toFixed(4)),
          val_loss: parseFloat(newValLoss.toFixed(4)),
        };
        
        setMetrics(prev => [...prev, newMetric]);
        
        // Update progress
        const newProgress = (newEpoch / totalEpochs) * 100;
        setProgress(newProgress);
        
        // Update status with metrics
        setStatusMessage(`Training Epoch ${newEpoch}/${totalEpochs} - Accuracy: ${newAccuracy.toFixed(2)}, Loss: ${newLoss.toFixed(2)}`);
        
        // If training is complete
        if (newEpoch >= totalEpochs) {
          clearInterval(trainingInterval);
          setIsTraining(false);
          setStatusMessage('Training completed successfully');
          toast.success('Training process completed');
        }
        
        return newEpoch;
      });
    }, 1000); // Update every second for the simulation
    
    // Cleanup function
    return () => clearInterval(trainingInterval);
  };

  return (
    <div className="p-4 border rounded-lg bg-black/50 backdrop-blur-sm text-white">
      <h2 className="text-xl font-bold mb-4">Training Control Panel</h2>
      
      <div className="mb-4">
        <p className="text-sm mb-2">Status: <span className="font-semibold">{statusMessage}</span></p>
        <div className="mb-2 flex justify-between text-xs">
          <span>Progress: {progress.toFixed(0)}%</span>
          <span>Epoch: {currentEpoch}/{totalEpochs}</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700" />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={startTraining} 
          disabled={isTraining}
          className="bg-green-600 hover:bg-green-700 text-white border-transparent"
        >
          Start Training
        </Button>
        <Button 
          variant="outline" 
          onClick={stopTraining} 
          disabled={!isTraining}
          className="bg-red-600 hover:bg-red-700 text-white border-transparent"
        >
          Stop Training
        </Button>
      </div>
      
      {metrics.length > 0 && (
        <TrainingMetricsDisplay metrics={metrics} />
      )}
      
      {metrics.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Training Log</h3>
          <div className="h-32 overflow-y-auto text-xs border border-gray-700 rounded p-2 bg-black/30">
            {metrics.map((metric, idx) => (
              <div key={idx} className="mb-1 text-gray-300">
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> Epoch {metric.epoch}: acc={metric.accuracy.toFixed(4)}, loss={metric.loss.toFixed(4)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingController;
