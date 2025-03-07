
// Define types for API responses and data structures

export interface MapLocation {
  id: number;
  name: string;
  type: string;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface RiskAssessment {
  id: number;
  region: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment_date: string;
  mitigation_measures?: string[];
  details?: {
    environmental_factors?: string[];
    population_density?: number;
    historical_data?: string;
  };
}

export interface WindDataPoint {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  u: number; // East-west component of wind vector
  v: number; // North-south component of wind vector
  speed: number; // Wind speed in m/s
  direction: number; // Wind direction in degrees (0-360)
  timestamp: string;
  position: {
    longitude: number;
    latitude: number;
    altitude: number;
  };
  weather: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
