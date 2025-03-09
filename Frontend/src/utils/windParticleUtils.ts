import { Cartesian3 } from '@cesium/engine';

export interface WindDataPoint {
  position: Cartesian3;
  direction: Cartesian3;
  speed: number;
}

export const createWindDataPoint = (
  lat: number,
  lon: number,
  height: number,
  directionDegrees: number,
  speed: number
): WindDataPoint => {
  const position = Cartesian3.fromDegrees(lon, lat, height);
  const direction = calculateWindDirection(directionDegrees);
  
  return {
    position,
    direction,
    speed
  };
};

const calculateWindDirection = (degrees: number): Cartesian3 => {
  const radians = (degrees * Math.PI) / 180;
  return new Cartesian3(
    Math.sin(radians),
    Math.cos(radians),
    0
  );
};

export const interpolateWindData = (
  point: Cartesian3,
  windData: WindDataPoint[]
): WindDataPoint | null => {
  if (!windData.length) return null;
  
  // Find nearest point - this is a simple implementation
  // You might want to implement more sophisticated interpolation
  let nearest = windData[0];
  let minDistance = Cartesian3.distance(point, nearest.position);
  
  for (const dataPoint of windData) {
    const distance = Cartesian3.distance(point, dataPoint.position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = dataPoint;
    }
  }
  
  return nearest;
};