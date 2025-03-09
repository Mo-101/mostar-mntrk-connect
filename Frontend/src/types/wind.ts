
export interface WindDataPoint {
  id: string;
  // Coordinates property (used in API)
  coordinates: [number, number];
  // Wind vector components
  u: number;
  v: number;
  speed: number;
  direction: number;
  timestamp: string;
  // Position property (used in visualization)
  position: {
    longitude: number;
    latitude: number;
    altitude: number;
  };
  // Weather condition
  weather?: string;
  // Visualization properties (not in API response)
  color?: string;
  velocity?: number;
}

// Used for 3D particle visualization
export interface Wind3DData {
  position: {
    longitude: number;
    latitude: number;
    altitude: number;
  };
  vector: {
    u: number;
    v: number;
    magnitude: number;
    direction: number;
  };
  properties: {
    speed: number;
    weather: string;
    timestamp: string;
  };
}

export interface ParticleSystemOptions {
  maxParticles?: number;
  particleSize?: number;
  speedFactor?: number;
  lifetime?: number;
}
