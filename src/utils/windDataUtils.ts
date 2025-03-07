
import { WindDataPoint, Wind3DData } from '@/types/wind';
import { Color } from 'cesium';

// Convert wind data points to a format usable by the 3D visualization system
export const processWindData = (dataPoints: WindDataPoint[]): Wind3DData => {
  return {
    particles: Math.min(dataPoints.length * 100, 5000),
    maxParticles: 10000, 
    particleHeight: 500,
    fadeOpacity: 0.9,
    dropRate: 0.003,
    dropRateBump: 0.01,
    speedFactor: 0.5,
    lineWidth: 4,
    width: 800,
    height: 600,
    points: dataPoints
  };
};

// Generate random wind data points for testing
export const generateMockWindData = (count: number = 5): WindDataPoint[] => {
  const mockPoints: WindDataPoint[] = [];
  
  // Center around Nigeria
  const centerLat = 9.0820;
  const centerLon = 8.6753;
  
  for (let i = 0; i < count; i++) {
    // Generate points in a grid around the center
    const latOffset = (Math.random() - 0.5) * 5; // +/- 2.5 degrees
    const lonOffset = (Math.random() - 0.5) * 5; // +/- 2.5 degrees
    
    // Wind properties
    const speed = 5 + Math.random() * 15; // 5-20 m/s
    const direction = Math.random() * 360; // 0-360 degrees
    
    // Calculate u/v components
    const uComponent = Math.sin(direction * Math.PI / 180) * speed;
    const vComponent = Math.cos(direction * Math.PI / 180) * speed;
    
    mockPoints.push({
      id: `wind-${i}`,
      coordinates: [centerLon + lonOffset, centerLat + latOffset] as [number, number],
      u: uComponent,
      v: vComponent,
      speed: speed,
      direction: direction,
      timestamp: new Date().toISOString(),
      position: {
        longitude: centerLon + lonOffset,
        latitude: centerLat + latOffset,
        altitude: 5000 + Math.random() * 10000 // 5-15km altitude
      },
      weather: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)]
    });
  }
  
  return mockPoints;
};

// Get appropriate color based on wind speed
export const getWindSpeedColor = (speed: number): Color => {
  if (speed < 5) {
    return new Color(0.2, 0.5, 0.9, 0.7); // Light blue for light winds
  } else if (speed < 10) {
    return new Color(0.1, 0.7, 0.5, 0.7); // Teal for moderate winds
  } else if (speed < 15) {
    return new Color(0.9, 0.6, 0.1, 0.8); // Orange for strong winds
  } else {
    return new Color(0.9, 0.2, 0.2, 0.9); // Red for very strong winds
  }
};
