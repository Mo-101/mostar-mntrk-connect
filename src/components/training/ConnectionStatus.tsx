
interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-xs text-gray-400">Database Connection:</span>
      <span className={`text-xs font-medium ${isConnected ? 'text-green-500' : 'text-amber-500'}`}>
        {isConnected ? 'Connected to Supabase' : 'Using Mock Data'}
      </span>
    </div>
  );
}
