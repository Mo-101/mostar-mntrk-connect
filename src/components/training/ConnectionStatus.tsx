
interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-xs text-gray-400">Database Connection:</span>
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
        <span className={`text-xs font-medium ${isConnected ? 'text-green-500' : 'text-amber-500'}`}>
          {isConnected ? 'Connected to Supabase' : 'Using Mock Data'}
        </span>
      </div>
    </div>
  );
}
