
import { useState, useEffect } from 'react';
import { AlertTriangle, Database, Info } from 'lucide-react';
import { supabase, testSupabaseConnection } from "@/integrations/supabase/client";
import { Tooltip } from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  useEffect(() => {
    const checkConnection = async () => {
      if (!isConnected && !isTestingConnection) {
        setIsTestingConnection(true);
        try {
          const result = await testSupabaseConnection();
          if (!result.connected && result.error) {
            setConnectionError(result.error);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        } finally {
          setIsTestingConnection(false);
        }
      }
    };
    
    checkConnection();
  }, [isConnected, isTestingConnection]);

  return (
    <div className="mb-4 flex items-center justify-between bg-[#1C2333] p-2 rounded-md">
      <span className="text-xs text-gray-400 flex items-center">
        <Database className="h-3 w-3 mr-1" />
        Database Connection:
      </span>
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
        <span className={`text-xs font-medium ${isConnected ? 'text-green-500' : 'text-amber-500'}`}>
          {isConnected ? 'Connected to Supabase' : 'Using Mock Data'}
        </span>
        
        {!isConnected && connectionError && (
          <Tooltip delayDuration={300}>
            <Tooltip.Trigger asChild>
              <button className="ml-2 text-amber-500 hover:text-amber-400 transition-colors">
                <AlertTriangle className="h-3 w-3" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-[#1C2333] border border-[#2A324B] p-2 text-xs max-w-xs">
              <p>Connection error: {connectionError}</p>
              <p className="mt-1">Using mock data as fallback.</p>
            </Tooltip.Content>
          </Tooltip>
        )}
        
        {isConnected && (
          <Tooltip delayDuration={300}>
            <Tooltip.Trigger asChild>
              <button className="ml-2 text-green-500 hover:text-green-400 transition-colors">
                <Info className="h-3 w-3" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-[#1C2333] border border-[#2A324B] p-2 text-xs">
              <p>Successfully connected to Supabase</p>
              <p className="mt-1">All data is live from the database</p>
            </Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
