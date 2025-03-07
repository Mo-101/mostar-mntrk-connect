import unittest
from flask import json
from swagger_server.utils.supabase_service import SupabaseService
from swagger_server.__main__ import app as api_app
from Agent.swagger_server.__main__ import app as agent_app
from swagger_server.utils.deepseek_service import DeepSeekService
import logging
from datetime import datetime
from unittest.mock import patch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestE2EFlow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        try:
            cls.supabase = SupabaseService()
            cls.deepseek = DeepSeekService()
            cls.api_client = api_app.test_client()
            cls.agent_client = agent_app.test_client()
            logger.info("Test clients and services initialized")
        except Exception as e:
            logger.error(f"Setup failed: {str(e)}")
            raise

    def setUp(self):
        """Set up test case"""
        self.headers = {
            'Content-Type': 'application/json'
        }

    def test_complete_observation_workflow(self):
        """Test complete workflow from observation to analysis"""
        # Step 1: Add new observation through API
        observation_data = {
            "location_id": 1,
            "observation_date": datetime.now().isoformat(),
            "population_count": 35,
            "habitat_description": "Dense vegetation near water source",
            "weather_conditions": {
                "temperature": 27,
                "humidity": 75
            }
        }

        response = self.api_client.post('/observations',
                                      data=json.dumps(observation_data),
                                      headers=self.headers)
        self.assertEqual(response.status_code, 201)
        observation = json.loads(response.data)[0]
        observation_id = observation['id']

        # Step 2: Add environmental data
        env_data = {
            "location_id": 1,
            "timestamp": datetime.now().isoformat(),
            "temperature": 27.5,
            "humidity": 75,
            "rainfall": 15.0,
            "soil_moisture": 0.48,
            "vegetation_index": 0.72
        }

        response = self.api_client.post('/environmental-data',
                                      data=json.dumps(env_data),
                                      headers=self.headers)
        self.assertEqual(response.status_code, 201)

        # Step 3: Perform habitat analysis using Agent
        habitat_request = {
            "location": {
                "latitude": observation["latitude"],
                "longitude": observation["longitude"]
            },
            "environmental_data": env_data,
            "analysis_parameters": {
                "timeframe": "current",
                "resolution": "high"
            }
        }

        response = self.agent_client.post('/ai/habitats',
                                        data=json.dumps(habitat_request),
                                        headers=self.headers)
        self.assertEqual(response.status_code, 200)
        habitat_analysis = json.loads(response.data)

        # Step 4: Perform risk analysis based on habitat analysis
        risk_request = {
            "region": str(observation["location_id"]),
            "timeframe": "1_month",
            "environmental_factors": {
                "temperature_range": [env_data["temperature"] - 5, env_data["temperature"] + 5],
                "humidity_range": [env_data["humidity"] - 10, env_data["humidity"] + 10],
                "rainfall": env_data["rainfall"]
            },
            "habitat_analysis": habitat_analysis
        }

        response = self.agent_client.post('/ai/forecast/risk-analysis',
                                        data=json.dumps(risk_request),
                                        headers=self.headers)
        self.assertEqual(response.status_code, 200)
        risk_analysis = json.loads(response.data)

        # Step 5: Update risk assessment in database
        risk_update = {
            "risk_level": risk_analysis["risk_level"],
            "factors": risk_analysis["factors"],
            "mitigation_measures": risk_analysis.get("mitigation_measures", [])
        }

        response = self.api_client.put(f'/risk-assessments/{observation["location_id"]}',
                                     data=json.dumps(risk_update),
                                     headers=self.headers)
        self.assertEqual(response.status_code, 200)

        # Step 6: Verify final state
        response = self.api_client.get(f'/location-summary/{observation["location_id"]}',
                                     headers=self.headers)
        self.assertEqual(response.status_code, 200)
        summary = json.loads(response.data)

        self.assertEqual(summary["latest_observation"]["id"], observation_id)
        self.assertEqual(summary["latest_risk_assessment"]["risk_level"], 
                        risk_analysis["risk_level"])

    def test_ai_analysis_workflow(self):
        """Test complete AI analysis workflow"""
        # Step 1: Get historical data from Supabase
        response = self.api_client.get('/observations',
                                     headers=self.headers)
        self.assertEqual(response.status_code, 200)
        historical_data = json.loads(response.data)

        # Step 2: Process with DeepSeek
        analysis_prompt = f"Analyze population trends from data: {historical_data}"
        deepseek_request = {
            "prompt": analysis_prompt,
            "model": "deepseek-coder"
        }

        response = self.agent_client.post('/deepseek',
                                        data=json.dumps(deepseek_request),
                                        headers=self.headers)
        self.assertEqual(response.status_code, 200)
        ai_analysis = json.loads(response.data)

        # Step 3: Generate RAG query based on analysis
        rag_request = {
            "query": "What are the key factors affecting population growth?",
            "context": {
                "analysis_result": ai_analysis["response"],
                "historical_data": historical_data
            }
        }

        response = self.agent_client.post('/ai/rag-query',
                                        data=json.dumps(rag_request),
                                        headers=self.headers)
        self.assertEqual(response.status_code, 200)
        rag_response = json.loads(response.data)

        # Verify complete workflow results
        self.assertTrue(ai_analysis.get('success'))
        self.assertIn('response', ai_analysis)
        self.assertIn('response', rag_response)
        self.assertIn('sources', rag_response)

    def test_error_recovery_workflow(self):
        """Test system recovery from errors in workflow"""
        # Step 1: Simulate failed observation submission
        with patch('swagger_server.utils.supabase_service.SupabaseService.add_observation') as mock_add:
            mock_add.return_value = {"success": False, "error": "Database error"}
            
            response = self.api_client.post('/observations',
                                          data=json.dumps({}),
                                          headers=self.headers)
            self.assertEqual(response.status_code, 400)

        # Step 2: Retry with valid data
        observation_data = {
            "location_id": 1,
            "observation_date": datetime.now().isoformat(),
            "population_count": 40
        }

        response = self.api_client.post('/observations',
                                      data=json.dumps(observation_data),
                                      headers=self.headers)
        self.assertEqual(response.status_code, 201)

        # Step 3: Simulate AI service failure
        with patch('swagger_server.utils.deepseek_service.DeepSeekService.process_prompt') as mock_process:
            mock_process.return_value = {"success": False, "error": "Service unavailable"}
            
            response = self.agent_client.post('/deepseek',
                                            data=json.dumps({"prompt": "test"}),
                                            headers=self.headers)
            self.assertEqual(response.status_code, 500)

        # Step 4: Verify system remains operational
        response = self.api_client.get('/locations',
                                     headers=self.headers)
        self.assertEqual(response.status_code, 200)

    def test_concurrent_workflow(self):
        """Test handling of concurrent workflows"""
        import concurrent.futures

        def execute_workflow():
            # Add observation
            obs_response = self.api_client.post('/observations',
                                              data=json.dumps({
                                                  "location_id": 1,
                                                  "observation_date": datetime.now().isoformat(),
                                                  "population_count": 35
                                              }),
                                              headers=self.headers)
            self.assertEqual(obs_response.status_code, 201)

            # Get analysis
            analysis_response = self.agent_client.post('/ai/habitats',
                                                     data=json.dumps({
                                                         "location": {"latitude": 0, "longitude": 0},
                                                         "environmental_data": {"temperature": 25}
                                                     }),
                                                     headers=self.headers)
            self.assertEqual(analysis_response.status_code, 200)

            return True

        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(execute_workflow) for _ in range(5)]
            results = [future.result() for future in futures]

        self.assertTrue(all(results))

if __name__ == '__main__':
    unittest.main()
