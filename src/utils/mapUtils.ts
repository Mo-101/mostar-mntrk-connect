
import { MapLocation, AlertMarker } from "@/types/map";
import { Color } from "cesium";

// Generate mock locations for the map
export const generateMockMapLocations = (): MapLocation[] => {
  return [
    {
      id: 1,
      name: "Maiduguri",
      coordinates: [13.1877, 11.8311],
      type: "observation",
      risk_level: "HIGH",
      details: {
        temperature: 32.4,
        humidity: 45,
        population_count: 78,
        description: "Urban area with high population density",
        last_observation: "2023-09-05T14:30:00Z"
      }
    },
    {
      id: 2,
      name: "Kano",
      coordinates: [8.5364, 12.0022],
      type: "risk",
      risk_level: "MEDIUM",
      details: {
        temperature: 30.1,
        humidity: 38,
        population_count: 42,
        description: "Semi-urban environment with moderate surveillance",
        last_observation: "2023-09-08T11:15:00Z"
      }
    },
    {
      id: 3,
      name: "Jos",
      coordinates: [8.8921, 9.8965],
      type: "monitoring",
      risk_level: "LOW",
      details: {
        temperature: 26.5,
        humidity: 55,
        population_count: 18,
        description: "Elevated region with cooler climate",
        last_observation: "2023-09-03T09:45:00Z"
      }
    },
    {
      id: 4,
      name: "Abuja",
      coordinates: [7.4951, 9.0579],
      type: "reference",
      risk_level: "LOW",
      details: {
        temperature: 28.2,
        humidity: 50,
        description: "Control monitoring site with low historical activity",
        last_observation: "2023-09-10T13:20:00Z"
      }
    },
    {
      id: 5,
      name: "Lagos",
      coordinates: [3.3792, 6.5244],
      type: "observation",
      risk_level: "MEDIUM",
      details: {
        temperature: 29.8,
        humidity: 75,
        population_count: 52,
        description: "Coastal urban area with high precipitation",
        last_observation: "2023-09-07T16:10:00Z"
      }
    },
    {
      id: 6,
      name: "Port Harcourt",
      coordinates: [7.0134, 4.8156],
      type: "risk",
      risk_level: "HIGH",
      details: {
        temperature: 30.5,
        humidity: 82,
        population_count: 67,
        description: "Delta region with favorable conditions for population growth",
        last_observation: "2023-09-04T10:30:00Z"
      }
    },
    {
      id: 7,
      name: "Enugu",
      coordinates: [7.4951, 6.4527],
      type: "monitoring",
      risk_level: "MEDIUM",
      details: {
        temperature: 27.3,
        humidity: 60,
        population_count: 29,
        description: "Eastern highlands with moderate surveillance coverage",
        last_observation: "2023-09-09T08:45:00Z"
      }
    },
    {
      id: 8,
      name: "Sokoto",
      coordinates: [5.2322, 13.0631],
      type: "observation",
      risk_level: "MEDIUM",
      details: {
        temperature: 33.8,
        humidity: 25,
        population_count: 31,
        description: "Arid northern region with seasonal population shifts",
        last_observation: "2023-09-06T14:00:00Z"
      }
    }
  ];
};

// Generate mock alert markers
export const generateMockAlerts = (): AlertMarker[] => {
  return [
    {
      id: "alert-1",
      coordinates: [13.1877, 11.8311], // Maiduguri
      color: "#ef4444",
      intensity: "high",
      message: "High population density detected in urban area",
      icon: "rat",
      created_at: "2023-09-10T09:30:00Z"
    },
    {
      id: "alert-2",
      coordinates: [7.0134, 4.8156], // Port Harcourt
      color: "#ef4444",
      intensity: "high",
      message: "Environmental conditions highly favorable for breeding",
      icon: "alert-triangle",
      created_at: "2023-09-10T08:15:00Z"
    },
    {
      id: "alert-3",
      coordinates: [8.5364, 12.0022], // Kano
      color: "#f97316",
      intensity: "medium",
      message: "Increasing population trend requires monitoring",
      icon: "thermometer-sun",
      created_at: "2023-09-10T10:45:00Z"
    },
    {
      id: "alert-4",
      coordinates: [3.3792, 6.5244], // Lagos
      color: "#f97316",
      intensity: "medium",
      message: "Elevated humidity creating favorable conditions",
      icon: "droplets",
      created_at: "2023-09-10T07:20:00Z"
    },
    {
      id: "alert-5",
      coordinates: [7.4951, 9.0579], // Abuja
      color: "#eab308",
      intensity: "low",
      message: "Routine monitoring recommended in urban periphery",
      icon: "eye",
      created_at: "2023-09-10T11:05:00Z"
    }
  ];
};

// Generate a color based on risk level
export const getRiskColor = (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'): string => {
  switch (riskLevel) {
    case 'HIGH':
      return '#ef4444'; // red-500
    case 'MEDIUM':
      return '#f97316'; // orange-500
    case 'LOW':
      return '#22c55e'; // green-500
    default:
      return '#64748b'; // slate-500
  }
};

// Create a marker element for a location
export const createLocationMarker = (type: string, color: string): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = 'location-marker';
  
  const innerMarker = document.createElement('div');
  innerMarker.className = 'w-5 h-5 rounded-full flex items-center justify-center';
  innerMarker.style.backgroundColor = color;
  
  // Add pulsating effect
  const pulse = document.createElement('div');
  pulse.className = 'absolute w-5 h-5 rounded-full animate-ping opacity-75';
  pulse.style.backgroundColor = color;
  
  marker.appendChild(pulse);
  marker.appendChild(innerMarker);
  
  return marker;
};

// Create an alert marker element
export const createAlertMarker = (intensity: 'low' | 'medium' | 'high', color: string): HTMLElement => {
  const marker = document.createElement('div');
  marker.className = 'alert-marker';
  
  const innerMarker = document.createElement('div');
  innerMarker.className = 'w-6 h-6 rounded-full flex items-center justify-center bg-black/50 border-2';
  innerMarker.style.borderColor = color;
  
  // Add pulsating effect based on intensity
  const pulse = document.createElement('div');
  
  switch(intensity) {
    case 'high':
      pulse.className = 'absolute w-10 h-10 rounded-full animate-ping opacity-75 animation-duration-500';
      break;
    case 'medium':
      pulse.className = 'absolute w-8 h-8 rounded-full animate-ping opacity-60 animation-duration-1000';
      break;
    case 'low':
      pulse.className = 'absolute w-6 h-6 rounded-full animate-ping opacity-50 animation-duration-1500';
      break;
  }
  
  pulse.style.backgroundColor = color;
  
  marker.appendChild(pulse);
  marker.appendChild(innerMarker);
  
  return marker;
};

// Mock API for getting location data
export const fetchMapLocations = async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return generateMockMapLocations();
};

// Mock API for getting alerts
export const fetchMapAlerts = async () => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  return generateMockAlerts();
};
