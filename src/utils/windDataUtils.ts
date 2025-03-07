
import { WindDataPoint, Wind3DData } from '@/types/api';

export const createWind3DData = (points: WindDataPoint[]): Wind3DData => {
  // Calculate min and max speeds
  const speeds = points.map(point => point.speed);
  const maxSpeed = Math.max(...speeds);
  const minSpeed = Math.min(...speeds);
  
  return {
    timestamp: new Date().toISOString(),
    points: points,
    maxSpeed,
    minSpeed,
    settings: {
      particleCount: 3000,
      particleSize: 2.0,
      lineWidth: 1.0,
      speedFactor: 0.5,
      colorScale: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000']
    }
  };
};

export const getWindColorForSpeed = (speed: number, minSpeed: number, maxSpeed: number): string => {
  const colors = ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'];
  const normalizedSpeed = Math.min(1, Math.max(0, (speed - minSpeed) / (maxSpeed - minSpeed || 1)));
  const index = Math.floor(normalizedSpeed * (colors.length - 1));
  
  return colors[index];
};

export const simulateWindData = (count: number = 10): WindDataPoint[] => {
  const points: WindDataPoint[] = [];
  
  // Create points around Nigeria and surrounding area
  for (let i = 0; i < count; i++) {
    // Random coordinates within and around Nigeria
    const longitude = 3 + Math.random() * 11; // ~3 to ~14 degrees (covers Nigeria)
    const latitude = 4 + Math.random() * 10; // ~4 to ~14 degrees (covers Nigeria)
    
    // Random wind components
    const u = (Math.random() - 0.5) * 10; // -5 to 5 m/s eastward component
    const v = (Math.random() - 0.5) * 10; // -5 to 5 m/s northward component
    
    // Calculate derived values
    const speed = Math.sqrt(u * u + v * v);
    const direction = Math.atan2(v, u) * (180 / Math.PI); // in degrees
    
    points.push({
      id: `wind-${i}`,
      coordinates: [longitude, latitude],
      u,
      v,
      speed,
      direction,
      timestamp: new Date().toISOString(),
      position: {
        longitude,
        latitude,
        altitude: 10000 + Math.random() * 5000 // Random altitude
      },
      weather: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)]
    });
  }
  
  return points;
};
