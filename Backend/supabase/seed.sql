INSERT INTO locations (name, latitude, longitude, elevation) VALUES
('Lagos Research Station', 6.5244, 3.3792, 41),
('Ibadan Field Site', 7.3775, 3.9470, 227),
('Port Harcourt Monitor Point', 4.8156, 7.0498, 15);

INSERT INTO observations (location_id, observation_date, population_count, habitat_description, weather_conditions, status) VALUES
(1, CURRENT_TIMESTAMP, 45, 'Urban environment with mixed vegetation', '{"temperature": 28, "humidity": 75}'::jsonb, 'verified'),
(2, CURRENT_TIMESTAMP, 32, 'Agricultural area with dense ground cover', '{"temperature": 26, "humidity": 80}'::jsonb, 'verified'),
(3, CURRENT_TIMESTAMP, 28, 'Coastal region with scattered vegetation', '{"temperature": 29, "humidity": 85}'::jsonb, 'verified');

INSERT INTO environmental_data (location_id, timestamp, temperature, humidity, rainfall, soil_moisture, vegetation_index) VALUES
(1, CURRENT_TIMESTAMP, 28.5, 75, 12.5, 0.45, 0.65),
(2, CURRENT_TIMESTAMP, 26.2, 80, 15.8, 0.52, 0.78),
(3, CURRENT_TIMESTAMP, 29.1, 85, 18.2, 0.48, 0.58);

INSERT INTO risk_assessments (location_id, assessment_date, risk_level, factors, mitigation_measures) VALUES
(1, CURRENT_TIMESTAMP, 'medium', '{"population_density": "high", "habitat_suitability": "medium"}'::jsonb, ARRAY['Increased monitoring', 'Public awareness campaigns']),
(2, CURRENT_TIMESTAMP, 'high', '{"population_density": "high", "habitat_suitability": "high"}'::jsonb, ARRAY['Daily surveillance', 'Preventive measures']),
(3, CURRENT_TIMESTAMP, 'low', '{"population_density": "low", "habitat_suitability": "medium"}'::jsonb, ARRAY['Regular monitoring', 'Habitat management']);
