import { useEffect, useRef } from 'react';
import { useApi } from "@/hooks/useApi";
import { WindDataPoint } from '@/types/api';

interface WindParticleSystem3DProps {
  viewer: any;
}

export function WindParticleSystem3D({ viewer }: WindParticleSystem3DProps) {
  const { api } = useApi();
  const windParticlesRef = useRef<any>(null);
  
  useEffect(() => {
    if (!viewer) return;
    
    const fetchWindData = async () => {
      try {
        const response = await api.wind.getData();
        if (response.success && response.data) {
          initParticleSystem(response.data);
        }
      } catch (error) {
        console.error("Error fetching wind data:", error);
      }
    };
    
    fetchWindData();
    
    // Clean up on unmount
    return () => {
      if (windParticlesRef.current) {
        viewer.scene.primitives.remove(windParticlesRef.current);
      }
    };
  }, [viewer, api]);
  
  const initParticleSystem = (windData: WindDataPoint[]) => {
    if (!viewer || !windData.length) return;
    
    // Remove existing particle system if any
    if (windParticlesRef.current) {
      viewer.scene.primitives.remove(windParticlesRef.current);
    }
    
    // Configure wind particle system
    const particleSystem = {
      particles: 3000,
      maxParticles: 5000,
      particleHeight: 500,
      fadeOpacity: 0.9,
      dropRate: 0.003,
      dropRateBump: 0.01,
      speedFactor: 1.0,
      lineWidth: 4.0,
      width: 1024,
      height: 1024,
      points: windData
    };
    
    // Create custom particle system primitive
    const customPrimitive = {
      show: true,
      update: function(frameState: any) {
        // This is a simplified placeholder for a real particle system implementation
        // In a full implementation, this would update particle positions based on wind data
        return true;
      }
    };
    
    // Store reference
    windParticlesRef.current = customPrimitive;
    
    // Add to scene
    viewer.scene.primitives.add(customPrimitive);
  };
  
  return null;
}
