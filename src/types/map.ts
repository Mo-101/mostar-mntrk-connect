
import { Color } from "cesium";

export interface MapLocation {
  id: number;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
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

export interface MapPopupInfo {
  location: MapLocation;
  content: HTMLElement | string;
}

export interface AlertMarker {
  id: string;
  coordinates: [number, number];
  color: string;
  intensity: 'low' | 'medium' | 'high';
  message: string;
  icon: string;
  created_at: string;
}
