import { WindDataPoint } from "@/types/wind";
import { Color } from "cesium";

// Generate mock database for simulating backend
export const generateMockDatabase = () => {
  // Generate locations (monitoring points)
  const locations = Array.from({ length: 12 }, (_, i) => {
    // Generate random coordinates within Nigeria
    const longitude = 3 + Math.random() * 11; // roughly 3 to 14 degrees
    const latitude = 4 + Math.random() * 10; // roughly 4 to 14 degrees
    
    return {
      id: i + 1,
      name: `Location ${String.fromCharCode(65 + i)}`,
      latitude,
      longitude,
      elevation: Math.floor(Math.random() * 500) + 100,
      created_at: new Date(2023, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
      updated_at: new Date().toISOString()
    };
  });
  
  // Generate environmental data
  const environmental_data = [];
  
  for (let i = 0; i < 100; i++) {
    const location_id = Math.floor(Math.random() * locations.length) + 1;
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
    
    environmental_data.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      location_id,
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 50,
      rainfall: Math.random() * 50,
      soil_moisture: 20 + Math.random() * 60,
      vegetation_index: Math.random() * 0.8,
      created_at: new Date().toISOString()
    });
  }
  
  // Generate mastomys observations
  const mastomys_observations = [];
  const statuses = ['pending', 'confirmed', 'rejected'];
  
  for (let i = 0; i < 50; i++) {
    const location_id = Math.floor(Math.random() * locations.length) + 1;
    const observation_date = new Date();
    observation_date.setDate(observation_date.getDate() - Math.floor(Math.random() * 60));
    
    mastomys_observations.push({
      id: `obs-${i + 1}`,
      location_id,
      observation_date: observation_date.toISOString(),
      population_count: Math.floor(Math.random() * 100) + 1,
      weather_conditions: {
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 50,
        rainfall: Math.random() * 30
      },
      habitat_description: getRandomHabitatDescription(),
      notes: getRandomObservationNotes(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(observation_date.getTime() + 1000 * 60 * 60).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  // Generate risk assessments
  const risk_assessments = [];
  const risk_levels = ['LOW', 'MEDIUM', 'HIGH'];
  
  for (let i = 0; i < 20; i++) {
    const location_id = Math.floor(Math.random() * locations.length) + 1;
    const assessment_date = new Date();
    assessment_date.setDate(assessment_date.getDate() - Math.floor(Math.random() * 30));
    
    const risk_level = risk_levels[Math.floor(Math.random() * risk_levels.length)];
    const population_density = Math.random() * 0.8 + 0.1;
    const habitat_suitability = Math.random() * 0.8 + 0.1;
    const human_proximity = Math.random() * 0.8 + 0.1;
    const historical_outbreaks = risk_level === 'HIGH' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2);
    
    risk_assessments.push({
      id: i + 1,
      location_id,
      assessment_date: assessment_date.toISOString(),
      risk_level,
      risk_score: (population_density * 0.4 + habitat_suitability * 0.3 + human_proximity * 0.2 + historical_outbreaks * 0.1),
      factors: {
        population_density,
        habitat_suitability,
        human_proximity,
        historical_outbreaks
      },
      mitigation_measures: generateMitigationMeasures(risk_level),
      created_at: new Date(assessment_date.getTime() + 1000 * 60 * 60).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  // Generate system metrics
  const system_metrics = Array.from({ length: 48 }, (_, i) => {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - i);
    
    return {
      id: `metric-${i + 1}`,
      timestamp: timestamp.toISOString(),
      cpu_usage: 10 + Math.random() * 60,
      ram_usage: 20 + Math.random() * 50,
      network_in: Math.floor(Math.random() * 1000) + 100,
      network_out: Math.floor(Math.random() * 800) + 50
    };
  });
  
  // Training modules
  const training_modules = [
    {
      id: "module-1",
      title: "Introduction to MN Tracking",
      description: "Basic introduction to the tracking system and its objectives.",
      content: "This module provides an overview of the MN tracking system...",
      duration_minutes: 15,
      order_index: 1,
      created_at: new Date(2023, 0, 15).toISOString()
    },
    {
      id: "module-2",
      title: "Field Data Collection",
      description: "Techniques for accurate field data collection and reporting.",
      content: "Learn proper protocols for collecting field data...",
      duration_minutes: 25,
      order_index: 2,
      created_at: new Date(2023, 0, 17).toISOString()
    },
    {
      id: "module-3",
      title: "Environmental Monitoring",
      description: "Methods for environmental condition assessment and monitoring.",
      content: "This module covers techniques for monitoring environmental conditions...",
      duration_minutes: 20,
      order_index: 3,
      created_at: new Date(2023, 0, 20).toISOString()
    },
    {
      id: "module-4",
      title: "Risk Assessment",
      description: "Understanding and performing risk assessments using the system.",
      content: "Learn how to interpret data and perform risk assessments...",
      duration_minutes: 30,
      order_index: 4,
      created_at: new Date(2023, 1, 5).toISOString()
    },
    {
      id: "module-5",
      title: "Community Engagement",
      description: "Strategies for effective community engagement and education.",
      content: "This module provides guidance on working with local communities...",
      duration_minutes: 25,
      order_index: 5,
      created_at: new Date(2023, 1, 10).toISOString()
    }
  ];
  
  // Training sessions
  const training_sessions = [
    {
      id: "session-1",
      user_id: "user-1",
      started_at: new Date(2023, 1, 15).toISOString(),
      last_activity_at: new Date(2023, 1, 18).toISOString(),
      completion_percentage: 60,
      status: "in_progress"
    },
    {
      id: "session-2",
      user_id: "user-2",
      started_at: new Date(2023, 1, 10).toISOString(),
      last_activity_at: new Date(2023, 1, 14).toISOString(),
      completion_percentage: 100,
      status: "completed"
    },
    {
      id: "session-3",
      user_id: "user-3",
      started_at: new Date(2023, 2, 5).toISOString(),
      last_activity_at: new Date(2023, 2, 5).toISOString(),
      completion_percentage: 20,
      status: "in_progress"
    }
  ];
  
  // Module progress
  const module_progress = [
    {
      session_id: "session-1",
      module_id: "module-1",
      status: "completed",
      score: 85,
      time_spent_minutes: 18,
      completed_at: new Date(2023, 1, 15).toISOString(),
      last_activity_at: new Date(2023, 1, 15).toISOString()
    },
    {
      session_id: "session-1",
      module_id: "module-2",
      status: "completed",
      score: 92,
      time_spent_minutes: 23,
      completed_at: new Date(2023, 1, 16).toISOString(),
      last_activity_at: new Date(2023, 1, 16).toISOString()
    },
    {
      session_id: "session-1",
      module_id: "module-3",
      status: "in_progress",
      score: null,
      time_spent_minutes: 10,
      completed_at: null,
      last_activity_at: new Date(2023, 1, 18).toISOString()
    },
    {
      session_id: "session-2",
      module_id: "module-1",
      status: "completed",
      score: 78,
      time_spent_minutes: 20,
      completed_at: new Date(2023, 1, 10).toISOString(),
      last_activity_at: new Date(2023, 1, 10).toISOString()
    },
    /* ... more module progress entries ... */
  ];
  
  // AI logs for demonstration
  const ai_logs = [
    {
      id: "log-1",
      prompt: "Analyze recent environmental data from Northeastern Nigeria",
      response: "Analysis shows 27% increase in suitable habitat conditions in northeastern regions compared to last quarter. Recommend increased surveillance in Maiduguri and surrounding areas due to favorable breeding conditions. Recent rainfall has created temporary water bodies that increase habitat suitability.",
      processing_time: 1253,
      timestamp: new Date(2023, 2, 1).toISOString()
    },
    {
      id: "log-2",
      prompt: "Predict population movements based on current weather patterns",
      response: "Current seasonal transitions suggest southward movement of populations following moisture gradients. Areas with recent precipitation (>20mm) show 35% higher probability of increased population density. Recommend focusing monitoring efforts along the Chad Basin edges where environmental conditions are most favorable.",
      processing_time: 1876,
      timestamp: new Date(2023, 2, 2).toISOString()
    },
    {
      id: "log-3",
      prompt: "Evaluate risk levels in urban vs rural environments",
      response: "Urban environments currently showing 42% higher risk indicators due to combination of food availability, shelter, and reduced predation. Rural agricultural areas with recent harvests also indicate elevated risk factors (moderate to high). Recommend community education in urban peripheral zones where human-rodent contact is most frequent.",
      processing_time: 1432,
      timestamp: new Date(2023, 2, 3).toISOString()
    }
  ];
  
  return {
    locations,
    environmental_data,
    mastomys_observations,
    risk_assessments,
    system_metrics,
    training_modules,
    training_sessions,
    module_progress,
    ai_logs
  };
};

// Helper function to generate random habitat descriptions
const getRandomHabitatDescription = () => {
  const habitats = [
    "Urban residential area with moderate vegetation",
    "Agricultural land with recent harvesting activity",
    "Grassland with scattered shrubs and proximity to water sources",
    "Village periphery with mixed agriculture and human settlements",
    "Forested area with dense undergrowth",
    "Semi-arid environment with seasonal vegetation",
    "Riverine habitat with dense riparian vegetation",
    "Urban market area with poor waste management",
    "Peri-urban settlement with subsistence agriculture",
    "School compound with food storage facilities"
  ];
  
  return habitats[Math.floor(Math.random() * habitats.length)];
};

// Helper function to generate random observation notes
const getRandomObservationNotes = () => {
  const notes = [
    "Multiple burrows identified near food storage areas",
    "Evidence of recent breeding activity observed",
    "Community reports of increased sightings in evening hours",
    "Specimen captured for laboratory verification",
    "Droppings and food damage indicate moderate population",
    "Nocturnal activity captured on monitoring cameras",
    "Multiple age groups observed indicating established population",
    "Seasonal migration pattern appears to be weather-dependent",
    "Limited activity compared to previous monitoring period",
    "Signs of competition with other rodent species evident"
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
};

// Helper function to generate mitigation measures based on risk level
const generateMitigationMeasures = (riskLevel: string) => {
  const baseMeasures = [
    "Regular monitoring and surveillance",
    "Community education about prevention measures",
    "Proper waste management and food storage practices"
  ];
  
  const mediumMeasures = [
    "Increased frequency of monitoring activities",
    "Environmental modification to reduce habitat suitability",
    "Targeted control measures in high-activity areas"
  ];
  
  const highMeasures = [
    "Immediate implementation of comprehensive control strategy",
    "Daily surveillance and reporting",
    "Enhanced community alert systems",
    "Coordination with health facilities for increased vigilance"
  ];
  
  switch(riskLevel) {
    case 'LOW':
      return baseMeasures;
    case 'MEDIUM':
      return [...baseMeasures, ...mediumMeasures];
    case 'HIGH':
      return [...baseMeasures, ...mediumMeasures, ...highMeasures];
    default:
      return baseMeasures;
  }
};

// Generate mock wind data points for visualization
export const generateMockWindData = (count: number = 10): WindDataPoint[] => {
  const baseLatitude = 9.0; // Nigeria
  const baseLongitude = 7.5;
  const spread = 2.0;
  
  return Array.from({ length: count }, (_, i) => {
    const u = (Math.random() * 20) - 10; // -10 to 10
    const v = (Math.random() * 20) - 10; // -10 to 10
    const speed = Math.sqrt(u * u + v * v);
    const direction = Math.atan2(v, u) * (180 / Math.PI);
    const latitude = baseLatitude + (Math.random() * spread) - (spread / 2);
    const longitude = baseLongitude + (Math.random() * spread) - (spread / 2);
    
    const weatherOptions = ['clear', 'cloudy', 'rain', 'wind', 'snow', 'thunderstorm'];
    const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    
    // Generate a color based on weather
    let color = '#3498db'; // Default blue
    switch(weather) {
      case 'clear': color = '#f1c40f'; break; // Yellow
      case 'cloudy': color = '#95a5a6'; break; // Gray
      case 'rain': color = '#3498db'; break; // Blue
      case 'wind': color = '#2ecc71'; break; // Green
      case 'snow': color = '#ecf0f1'; break; // White
      case 'thunderstorm': color = '#9b59b6'; break; // Purple
    }
    
    return {
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
        altitude: 500 + Math.random() * 1000
      },
      weather,
      color // Now valid with updated type
    };
  });
};

// Mock function for DeepSeek habitat analysis
export const mockDeepSeekHabitatAnalysis = async (region: string) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const randomSuitability = Math.random();
  let suitabilityClassification;
  let keyFactors = [];
  
  if (randomSuitability > 0.7) {
    suitabilityClassification = "High";
    keyFactors = [
      "Elevated soil moisture from recent rainfall",
      "Optimal temperature range (24-30°C)",
      "Abundant food sources from agricultural activity",
      "Suitable sheltering locations in urban periphery"
    ];
  } else if (randomSuitability > 0.4) {
    suitabilityClassification = "Moderate";
    keyFactors = [
      "Moderate soil moisture levels",
      "Acceptable temperature range",
      "Some food availability",
      "Limited shelter options"
    ];
  } else {
    suitabilityClassification = "Low";
    keyFactors = [
      "Dry conditions limiting population growth",
      "Temperature extremes outside optimal range",
      "Limited food resources",
      "Insufficient shelter options"
    ];
  }
  
  // Create seasonal patterns data
  const seasonalTrends = [
    {
      season: "Rainy",
      suitability: Math.min(randomSuitability + 0.2, 0.99),
      notes: "Increased habitat suitability due to moisture and vegetation growth"
    },
    {
      season: "Dry",
      suitability: Math.max(randomSuitability - 0.3, 0.1),
      notes: "Reduced suitability due to water scarcity"
    },
    {
      season: "Transitional",
      suitability: randomSuitability,
      notes: "Moderate conditions with changing environmental factors"
    }
  ];
  
  // Create population projection
  const currentPopulationIndex = Math.random() * 100;
  const projections = {
    "3_month": currentPopulationIndex * (Math.random() * 0.5 + 0.8),
    "6_month": currentPopulationIndex * (Math.random() * 0.8 + 0.7),
    "12_month": currentPopulationIndex * (Math.random() * 1.2 + 0.5)
  };
  
  // Create recommendations
  const recommendations = [
    "Continue monitoring environmental conditions, especially soil moisture and temperature",
    "Focus surveillance efforts in areas with highest suitability scores",
    "Implement preventive measures before projected population increases",
    "Engage local communities in early detection and reporting"
  ];
  
  return {
    region,
    analysis_date: new Date().toISOString(),
    habitat_suitability_score: randomSuitability.toFixed(2),
    suitability_classification: suitabilityClassification,
    key_factors: keyFactors,
    seasonal_trends: seasonalTrends,
    population_projections: projections,
    recommendations,
    confidence_score: (0.7 + Math.random() * 0.25).toFixed(2)
  };
};
