
import { Wind3DData } from "@/types/wind";

// Function to fetch simulated wind data
export const fetchWindData = async (): Promise<Wind3DData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create mock wind data grid
  const lon = 36;  // number of longitude points
  const lat = 18;  // number of latitude points
  
  // Create arrays for longitude and latitude coordinates
  const lonArray = Array.from({ length: lon }, (_, i) => 0 + (i * 10));
  const latArray = Array.from({ length: lat }, (_, i) => -90 + (i * 10));
  
  // Generate U and V wind components
  const uArray = [];
  const vArray = [];
  let uMin = Infinity;
  let uMax = -Infinity;
  let vMin = Infinity;
  let vMax = -Infinity;
  
  for (let j = 0; j < lat; j++) {
    for (let i = 0; i < lon; i++) {
      // Create some patterns in the data
      const u = Math.sin(j / lat * Math.PI) * 10 + (Math.random() * 5 - 2.5);
      const v = Math.cos(i / lon * Math.PI) * 10 + (Math.random() * 5 - 2.5);
      
      uArray.push(u);
      vArray.push(v);
      
      // Update min/max values
      uMin = Math.min(uMin, u);
      uMax = Math.max(uMax, u);
      vMin = Math.min(vMin, v);
      vMax = Math.max(vMax, v);
    }
  }
  
  return {
    dimensions: {
      lon,
      lat
    },
    lon: lonArray,
    lat: latArray,
    U: {
      array: uArray,
      min: uMin,
      max: uMax
    },
    V: {
      array: vArray,
      min: vMin,
      max: vMax
    }
  };
};
