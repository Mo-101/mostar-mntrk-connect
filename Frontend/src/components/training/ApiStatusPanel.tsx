
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { useMockApi } from "@/hooks/useMockApi";
import { SystemMetric } from '@/types/api';

export function ApiStatusPanel() {
  const { apiCall, api } = useMockApi();
  const [status, setStatus] = useState<'online' | 'offline'>('offline');
  const [responseTime, setResponseTime] = useState(0);
  const [lastChecked, setLastChecked] = useState<string>('');
  const [endpoints, setEndpoints] = useState<{name: string; status: string}[]>([]);

  useEffect(() => {
    const checkStatus = async () => {
      const startTime = Date.now();
      try {
        // Use our mock API for the status check
        const latestMetric = await apiCall<SystemMetric>(() => api.systemMetrics.getLatest());
        const endTime = Date.now();
        
        if (latestMetric) {
          setStatus('online');
          setResponseTime(endTime - startTime);
          
          // Generate endpoint statuses
          setEndpoints([
            { name: 'Mastomys API', status: 'Available' },
            { name: 'Storage API', status: 'Available' },
            { name: 'Auth API', status: latestMetric.cpu_usage > 80 ? 'High Load' : 'Available' }
          ]);
        } else {
          setStatus('offline');
        }
        
        setLastChecked(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('API connection error:', error);
        setStatus('offline');
        setLastChecked(new Date().toLocaleTimeString());
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">API Status</div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-xs font-medium ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="bg-[#1C2333] p-3 rounded-md">
        <div className="flex justify-between mb-1.5">
          <span className="text-sm text-gray-300">Response Time</span>
          <span className="text-sm font-mono text-gray-200">{responseTime}ms</span>
        </div>
        <Progress 
          value={Math.min(responseTime / 5, 100)} 
          className="h-2 bg-[#0D1326]" 
          style={{
            "--progress-indicator-color": responseTime < 200 ? "#10B981" : responseTime < 500 ? "#EAB308" : "#EF4444"
          } as React.CSSProperties}
        />
      </div>
      
      <div className="bg-[#1C2333] p-3 rounded-md">
        <div className="text-sm text-gray-300 mb-1.5">Endpoints</div>
        <div className="grid grid-cols-1 gap-2">
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{endpoint.name}</span>
              <span className={`${
                endpoint.status === 'Available' 
                  ? 'text-green-400' 
                  : endpoint.status === 'High Load' 
                  ? 'text-yellow-400' 
                  : 'text-red-400'
              }`}>
                {endpoint.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2A324B]">
        <div className="text-xs text-gray-400">
          Last checked: {lastChecked || 'N/A'}
        </div>
      </div>
    </div>
  );
}
