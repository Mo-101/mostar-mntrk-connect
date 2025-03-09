
// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// System metrics
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

// Risk assessment
export interface RiskAssessment {
  id: number;
  region: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment_date: string;
  mitigation_measures: string[];
  details: {
    environmental_factors: string[];
    population_density: number;
    historical_data: string;
  };
}

// Training metrics
export interface TrainingMetric {
  id: number;
  epoch: number;
  accuracy: number;
  loss: number;
  val_accuracy: number;
  val_loss: number;
  timestamp: string;
}

// AI logs
export interface AILog {
  id: number;
  model: string;
  prompt: string;
  response: string;
  timestamp: string;
  tokens_used: number;
  latency_ms: number;
}

// DeepSeek analysis result
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

// Wind data point for 3D visualization
export interface WindDataPoint {
  id: string;
  coordinates: [number, number];
  u: number;
  v: number;
  speed: number;
  direction: number;
  timestamp: string;
  position: {
    longitude: number;
    latitude: number;
    altitude: number;
  };
  weather: string;
}

// Types for LM Studio integration
export interface LMStudioConfig {
  baseUrl: string;
  port: number;
  enabled: boolean;
  modelId: string;
}

export interface LMStudioResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Map data types
export interface MapLocation {
  id: number;
  name: string;
  coordinates: [number, number];
  type: 'observation' | 'risk' | 'monitoring' | 'reference';
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  details?: {
    temperature?: number;
    humidity?: number;
    population_count?: number;
    description?: string;
    last_observation?: string;
  };
}

export interface MapAlert {
  id: number | string;
  location: string;
  coordinates: [number, number];
  riskLevel: string;
  timestamp: string;
}

// Wind 3D data type for particle system
export interface Wind3DData {
  particles: number;
  maxParticles: number;
  particleHeight: number;
  fadeOpacity: number;
  dropRate: number;
  dropRateBump: number;
  speedFactor: number;
  lineWidth: number;
  width: number;
  height: number;
  points: WindDataPoint[];
}
