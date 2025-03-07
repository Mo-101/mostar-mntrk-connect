
// Define types for API responses and data structures

export interface MapLocation {
  id: number;
  name: string;
  type: string;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  coordinates: [number, number]; // [longitude, latitude]
  details?: {
    temperature?: number;
    humidity?: number;
    population_count?: number;
    description?: string;
    last_observation?: string;
  };
}

export interface MapAlert {
  id: number;
  location: string;
  coordinates: [number, number];
  riskLevel: string;
  timestamp: string;
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

export interface SystemMetric {
  id: number;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_traffic: number;
  api_requests: number;
  status: 'healthy' | 'warning' | 'critical';
}

export interface TrainingMetric {
  id: number;
  epoch: number;
  accuracy: number;
  loss: number;
  val_accuracy?: number;
  val_loss?: number;
  timestamp: string;
}

export interface AILog {
  id: number;
  model: string;
  prompt: string;
  response: string;
  timestamp: string;
  tokens_used: number;
  latency_ms: number;
}

export interface DeepSeekAnalysis {
  response: string;
  metadata: {
    category: string;
    confidence: number;
    regions_affected: string[];
    risk_level: string;
    processing_time: number;
    source: string;
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

export interface Wind3DData {
  timestamp: string;
  points: WindDataPoint[];
  maxSpeed: number;
  minSpeed: number;
  settings?: {
    particleCount?: number;
    particleSize?: number;
    lineWidth?: number;
    speedFactor?: number;
    colorScale?: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
