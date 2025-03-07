
import { useState, useEffect } from 'react';
import { AlertTriangle, Database, Info } from 'lucide-react';
import { supabase, testSupabaseConnection, USE_MOCK_DATA } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [localConnectionStatus, setLocalConnectionStatus] = useState(isConnected);
  
  // Check connection on component mount and when isConnected prop changes
  useEffect(() => {
    const checkConnection = async () => {
      if (!isTestingConnection) {
        setIsTestingConnection(true);
        try {
          const result = await testSupabaseConnection();
          setLocalConnectionStatus(result.connected);
          
          if (!result.connected && result.error) {
            setConnectionError(result.error);
          } else {
            setConnectionError(null);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
          setLocalConnectionStatus(false);
          setConnectionError(error instanceof Error ? error.message : "Unknown error");
        } finally {
          setIsTestingConnection(false);
        }
      }
    };
    
    checkConnection();
  }, [isConnected, isTestingConnection]);

  // Retry connection function
  const handleRetryConnection = async () => {
    toast.info("Retrying connection to Supabase...");
    setIsTestingConnection(true);
    
    try {
      const result = await testSupabaseConnection();
      setLocalConnectionStatus(result.connected);
      
      if (!result.connected) {
        if (result.error) {
          setConnectionError(result.error);
          toast.error(`Connection failed: ${result.error}`);
        }
      } else {
        setConnectionError(null);
        toast.success("Successfully connected to Supabase");
      }
    } catch (error) {
      setLocalConnectionStatus(false);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setConnectionError(errorMessage);
      toast.error(`Connection error: ${errorMessage}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="mb-4 flex items-center justify-between bg-[#1C2333] p-2 rounded-md">
        <span className="text-xs text-gray-400 flex items-center">
          <Database className="h-3 w-3 mr-1" />
          Database Connection:
        </span>
        <div className="flex items-center">
          <div 
            className={`h-2 w-2 rounded-full mr-2 ${localConnectionStatus ? 'bg-green-500' : USE_MOCK_DATA ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}
          ></div>
          <span className={`text-xs font-medium ${localConnectionStatus ? 'text-green-500' : USE_MOCK_DATA ? 'text-amber-500' : 'text-red-500'}`}>
            {localConnectionStatus ? 'Connected to Supabase' : USE_MOCK_DATA ? 'Using Mock Data' : 'Connection Failed'}
          </span>
          
          {!localConnectionStatus && connectionError && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button className="ml-2 text-amber-500 hover:text-amber-400 transition-colors">
                  <AlertTriangle className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1C2333] border border-[#2A324B] p-2 text-xs max-w-xs">
                <p>Connection error: {connectionError}</p>
                <p className="mt-1">{USE_MOCK_DATA ? "Using mock data as configured." : "Using mock data as fallback."}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {localConnectionStatus && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <button className="ml-2 text-green-500 hover:text-green-400 transition-colors">
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1C2333] border border-[#2A324B] p-2 text-xs">
                <p>Successfully connected to Supabase</p>
                <p className="mt-1">All data is live from the database</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {!localConnectionStatus && !USE_MOCK_DATA && (
            <button 
              onClick={handleRetryConnection}
              disabled={isTestingConnection}
              className="ml-2 text-xs bg-[#2A324B] hover:bg-[#3A425B] px-2 py-0.5 rounded text-gray-300 transition-colors disabled:opacity-50"
            >
              {isTestingConnection ? "Retrying..." : "Retry"}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
