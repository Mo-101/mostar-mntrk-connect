import { ApiResponse, SystemMetric, RiskAssessment, TrainingMetric, AILog, WindDataPoint, MapLocation, MapAlert } from "@/types/api";

// Simulated network delay
const addDelay = (min = 200, max = 600) => {
  const delay = Math.floor(Math.random() * (max - min)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Generate mock map locations
const generateMapLocations = (): MapLocation[] => {
  return [
    {
      id: 1,
      name: "Lagos",
      coordinates: [3.3792, 6.5244],
      type: "monitoring",
      risk_level: "MEDIUM",
      details: {
        temperature: 28.5,
        humidity: 75,
        population_count: 127,
        description: "Urban monitoring station",
        last_observation: new Date().toISOString()
      }
    },
    {
      id: 2,
      name: "Abuja",
      coordinates: [7.4951, 9.0579],
      type: "observation",
      risk_level: "LOW",
      details: {
        temperature: 26.2,
        humidity: 65,
        population_count: 43,
        description: "Capital region observation point",
        last_observation: new Date().toISOString()
      }
    },
    {
      id: 3,
      name: "Kano",
      coordinates: [8.5364, 12.0022],
      type: "monitoring",
      risk_level: "LOW",
      details: {
        temperature: 30.1,
        humidity: 45,
        population_count: 38,
        description: "Northern region monitoring",
        last_observation: new Date().toISOString()
      }
    },
    {
      id: 4,
      name: "Port Harcourt",
      coordinates: [7.0134, 4.8156],
      type: "monitoring",
      risk_level: "HIGH",
      details: {
        temperature: 27.8,
        humidity: 85,
        population_count: 156,
        description: "Coastal monitoring station",
        last_observation: new Date().toISOString()
      }
    },
    {
      id: 5,
      name: "Maiduguri",
      coordinates: [13.1877, 11.8311],
      type: "reference",
      risk_level: "HIGH",
      details: {
        temperature: 32.4,
        humidity: 35,
        population_count: 98,
        description: "Northeastern reference station",
        last_observation: new Date().toISOString()
      }
    }
  ];
};

// Generate mock alerts
const generateMapAlerts = (): MapAlert[] => {
  return [
    {
      id: 1,
      location: "Port Harcourt",
      coordinates: [7.0134, 4.8156],
      riskLevel: "HIGH",
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      location: "Maiduguri",
      coordinates: [13.1877, 11.8311],
      riskLevel: "HIGH",
      timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: 3,
      location: "Lagos",
      coordinates: [3.3792, 6.5244],
      riskLevel: "MEDIUM",
      timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ];
};

// Generate mock system metrics
const generateSystemMetrics = (): SystemMetric[] => {
  const metrics = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - i * 3600000);
    const cpuUsage = Math.floor(Math.random() * 40) + 20; // 20-60%
    
    metrics.push({
      id: i + 1,
      timestamp: timestamp.toISOString(),
      cpu_usage: cpuUsage,
      memory_usage: Math.floor(Math.random() * 30) + 40, // 40-70%
      disk_usage: Math.floor(Math.random() * 20) + 30, // 30-50%
      network_traffic: Math.floor(Math.random() * 1000) + 500, // 500-1500 KB/s
      api_requests: Math.floor(Math.random() * 100) + 50, // 50-150 requests
      status: cpuUsage > 80 ? 'critical' : cpuUsage > 60 ? 'warning' : 'healthy'
    });
  }
  
  return metrics;
};

// Generate mock risk assessments
const generateRiskAssessments = (): RiskAssessment[] => {
  const regions = [
    "Lagos", "Abuja", "Kano", "Port Harcourt", "Maiduguri", 
    "Enugu", "Sokoto", "Jos", "Calabar", "Ibadan"
  ];
  
  const mitigationMeasures = [
    "Increase environmental monitoring frequency",
    "Deploy additional surveillance sensors",
    "Implement community reporting system",
    "Establish early warning protocols",
    "Enhance predictive modeling capabilities",
    "Conduct routine habitat surveys",
    "Increase monitoring station density",
    "Deploy mobile detection units",
    "Establish data collection protocols",
    "Implement real-time alert system"
  ];
  
  const now = new Date();
  const assessments = [];
  
  for (let i = 0; i < regions.length; i++) {
    const riskLevel = Math.random() < 0.2 ? 'HIGH' : Math.random() < 0.5 ? 'MEDIUM' : 'LOW';
    const date = new Date(now.getTime() - Math.floor(Math.random() * 7) * 86400000);
    
    // Select 3-5 random mitigation measures
    const measures = [...mitigationMeasures]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 3);
      
    assessments.push({
      id: i + 1,
      region: regions[i],
      risk_level: riskLevel as 'LOW' | 'MEDIUM' | 'HIGH',
      assessment_date: date.toISOString(),
      mitigation_measures: measures,
      details: {
        environmental_factors: [
          "Temperature: " + (Math.random() * 15 + 20).toFixed(1) + "°C",
          "Humidity: " + (Math.random() * 40 + 40).toFixed(1) + "%",
          "Precipitation: " + (Math.random() * 200).toFixed(1) + "mm/month"
        ],
        population_density: Math.floor(Math.random() * 100) + 5,
        historical_data: "Historical trend shows " + 
          (Math.random() < 0.3 ? "increasing" : Math.random() < 0.6 ? "stable" : "decreasing") + 
          " population levels over the past 6 months."
      }
    });
  }
  
  return assessments;
};

// Generate mock training metrics
const generateTrainingMetrics = (): TrainingMetric[] => {
  const metrics = [];
  const epochs = 50;
  
  for (let i = 0; i < epochs; i++) {
    const accuracy = Math.min(0.5 + (i / epochs) * 0.45, 0.95) + (Math.random() * 0.05);
    const loss = Math.max(0.5 - (i / epochs) * 0.45, 0.05) + (Math.random() * 0.05);
    
    const val_accuracy = accuracy - (Math.random() * 0.1);
    const val_loss = loss + (Math.random() * 0.1);
    
    const timestamp = new Date(Date.now() - (epochs - i) * 300000).toISOString();
    
    metrics.push({
      id: i + 1,
      epoch: i + 1,
      accuracy,
      loss,
      val_accuracy,
      val_loss,
      timestamp
    });
  }
  
  return metrics;
};

// Generate mock AI logs
const generateAILogs = (): AILog[] => {
  const logs = [];
  const prompts = [
    "Analyze recent detection patterns in Lagos region",
    "Compare population density between urban and rural areas",
    "Predict movement patterns based on environmental changes",
    "Evaluate effectiveness of current monitoring strategy",
    "Identify high-risk zones based on historical data",
    "Generate report on seasonal migration patterns",
    "Analyze correlation between temperature and population growth",
    "Evaluate impact of recent rainfall on habitat suitability"
  ];
  
  for (let i = 0; i < prompts.length; i++) {
    const now = new Date();
    const timestamp = new Date(now.getTime() - i * 3600000 * (Math.random() * 3 + 1));
    
    logs.push({
      id: i + 1,
      model: Math.random() > 0.5 ? "deepseek-coder-v0.2" : "deepseek-v0.3",
      prompt: prompts[i],
      response: "Generated detailed analysis with " + (Math.floor(Math.random() * 5) + 2) + " key insights.",
      timestamp: timestamp.toISOString(),
      tokens_used: Math.floor(Math.random() * 1000) + 500,
      latency_ms: Math.floor(Math.random() * 2000) + 500
    });
  }
  
  return logs;
};

// Generate mock wind data points
const generateWindDataPoints = (): WindDataPoint[] => {
  const points: WindDataPoint[] = [];
  const locations = [
    [13.1877, 11.8311], // Maiduguri
    [8.5364, 12.0022],  // Kano
    [8.8921, 9.8965],   // Jos
    [7.4951, 9.0579],   // Abuja
    [3.3792, 6.5244],   // Lagos
    [7.0134, 4.8156],   // Port Harcourt
    [7.4951, 6.4527],   // Enugu
    [5.2322, 13.0631]   // Sokoto
  ];
  
  locations.forEach((coords, index) => {
    const u = (Math.random() * 10) - 5; // -5 to 5 m/s
    const v = (Math.random() * 10) - 5; // -5 to 5 m/s
    const speed = Math.sqrt(u * u + v * v);
    const direction = Math.atan2(v, u) * (180 / Math.PI);
    
    points.push({
      id: `wind-${index + 1}`,
      coordinates: coords as [number, number],
      u,
      v,
      speed,
      direction,
      timestamp: new Date().toISOString(),
      position: {
        longitude: coords[0],
        latitude: coords[1],
        altitude: 0
      },
      weather: ['clear', 'cloudy', 'rain', 'partly cloudy'][Math.floor(Math.random() * 4)]
    });
  });
  
  return points;
};

// Mock API service
export const mockApiService = {
  // System metrics endpoints
  systemMetrics: {
    getAll: async (): Promise<ApiResponse<SystemMetric[]>> => {
      await addDelay();
      return {
        success: true,
        data: [] // This would come from generateSystemMetrics() in the original file
      };
    },
    getLatest: async (): Promise<ApiResponse<SystemMetric>> => {
      await addDelay();
      return {
        success: true,
        data: {
          id: 1,
          timestamp: new Date().toISOString(),
          cpu_usage: Math.random() * 40 + 20,
          memory_usage: Math.random() * 30 + 40,
          disk_usage: Math.random() * 20 + 30,
          network_traffic: Math.random() * 1000 + 500,
          api_requests: Math.random() * 100 + 50,
          status: 'healthy'
        }
      };
    }
  },
  
  // Risk assessment endpoints
  riskAssessments: {
    getAll: async (): Promise<ApiResponse<RiskAssessment[]>> => {
      await addDelay();
      return {
        success: true,
        data: [] // This would come from generateRiskAssessments() in the original file
      };
    },
    getLatest: async (): Promise<ApiResponse<RiskAssessment[]>> => {
      await addDelay();
      return {
        success: true,
        data: [{
          id: 1,
          region: "Lagos",
          risk_level: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
          assessment_date: new Date().toISOString(),
          mitigation_measures: [
            "Increase environmental monitoring frequency",
            "Deploy additional surveillance sensors",
            "Implement community reporting system"
          ],
          details: {
            environmental_factors: [
              "Temperature: 28.5°C",
              "Humidity: 75%",
              "Precipitation: 120mm/month"
            ],
            population_density: 45,
            historical_data: "Historical trend shows increasing population levels over the past 6 months."
          }
        }]
      };
    }
  },
  
  // Training metrics endpoints
  trainingMetrics: {
    getAll: async (): Promise<ApiResponse<TrainingMetric[]>> => {
      await addDelay();
      return {
        success: true,
        data: [] // This would come from generateTrainingMetrics() in the original file
      };
    },
    getLatest: async (): Promise<ApiResponse<TrainingMetric>> => {
      await addDelay();
      return {
        success: true,
        data: {
          id: 1,
          epoch: 25,
          accuracy: 0.85,
          loss: 0.15,
          val_accuracy: 0.82,
          val_loss: 0.18,
          timestamp: new Date().toISOString()
        }
      };
    }
  },
  
  // AI logs endpoints
  aiLogs: {
    getAll: async (): Promise<ApiResponse<AILog[]>> => {
      await addDelay();
      return {
        success: true,
        data: [] // This would come from generateAILogs() in the original file
      };
    }
  },
  
  // Wind data endpoint
  wind: {
    getData: async (): Promise<ApiResponse<WindDataPoint[]>> => {
      await addDelay();
      return {
        success: true,
        data: generateWindDataPoints()
      };
    }
  },
  
  // Map data services - Adding the missing methods
  mapData: {
    getLocations: async (): Promise<MapLocation[]> => {
      await addDelay();
      return generateMapLocations();
    },
    
    getAlerts: async (): Promise<MapAlert[]> => {
      await addDelay();
      return generateMapAlerts();
    }
  }
};

// Mock DeepSeek client with enhanced response format
export const mockDeepSeekClient = {
  analyze: async (prompt: string): Promise<ApiResponse<any>> => {
    await addDelay(800, 2000);
    
    // Mock deepseek analysis responses with more detailed data
    const responses = [
      {
        response: "Analysis complete. Detected patterns suggest seasonal migration is affected by recent rainfall patterns.",
        metadata: {
          category: "migration",
          confidence: 0.87,
          regions_affected: ["Lagos", "Port Harcourt"],
          risk_level: "MEDIUM",
          processing_time: 1.2,
          source: "mock_data"
        }
      },
      {
        response: "Evaluation indicates a 32% increase in population density within urban monitoring zones.",
        metadata: {
          category: "population_density",
          confidence: 0.91,
          regions_affected: ["Abuja", "Kano"],
          risk_level: "HIGH",
          processing_time: 0.9,
          source: "mock_data"
        }
      },
      {
        response: "Predictive model suggests movement towards coastal regions due to changing temperature gradients.",
        metadata: {
          category: "environmental",
          confidence: 0.83,
          regions_affected: ["Calabar", "Port Harcourt"],
          risk_level: "MEDIUM",
          processing_time: 1.5,
          source: "mock_data"
        }
      },
      {
        response: "Environmental assessment complete. Temperature and humidity conditions are favorable for population growth in the identified regions.",
        metadata: {
          category: "outbreak_prediction",
          confidence: 0.88,
          regions_affected: ["Maiduguri", "Sokoto"],
          risk_level: "HIGH",
          processing_time: 1.1,
          source: "mock_data"
        }
      }
    ];
    
    return {
      success: true,
      data: responses[Math.floor(Math.random() * responses.length)]
    };
  }
};
