
// Only updating the channelToTable function to fix the error related to 'wind_data' table
const channelToTable = (channel: string): string | null => {
  switch (channel) {
    case 'wind-update':
      // Return an existing table or null if we're in mock mode
      return USE_MOCK_DATA ? null : 'environmental_data';
    case 'risk-assessment':
      return 'risk_assessments';
    case 'training-update':
      return 'training_metrics';
    case 'training-command':
      return 'training_sessions';
    case 'weather-update':
      return 'environmental_data';
    default:
      return null;
  }
};
