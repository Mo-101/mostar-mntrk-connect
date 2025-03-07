import unittest
import pytest
from flask import json
from swagger_server.utils.supabase_service import SupabaseService
from swagger_server.__main__ import app
import logging
from datetime import datetime
from unittest.mock import patch, MagicMock
import time
import concurrent.futures

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestAPIIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        try:
            cls.supabase = SupabaseService()
            cls.client = app.test_client()
            logger.info("Test client and Supabase service initialized")
        except Exception as e:
            logger.error(f"Setup failed: {str(e)}")
            raise

    def setUp(self):
        """Set up test case"""
        self.headers = {
            'Content-Type': 'application/json'
        }
        self.performance_threshold = 1.0  # seconds

    @pytest.mark.parametrize("filters,expected_status,expected_type", [
        ({}, 200, list),
        ({"region": "test_region"}, 200, list),
        ({"habitat_type": "forest"}, 200, list),
        ({"invalid_filter": "value"}, 400, dict)
    ])
    def test_get_locations_endpoint(self, filters, expected_status, expected_type):
        """Test GET /locations endpoint with various filters"""
        start_time = time.time()
        
        response = self.client.get('/locations', 
                                 query_string=filters,
                                 headers=self.headers)
        
        response_time = time.time() - start_time
        self.assertLess(response_time, self.performance_threshold, 
                       f"Response time {response_time}s exceeded threshold {self.performance_threshold}s")
        
        self.assertEqual(response.status_code, expected_status)
        data = json.loads(response.data)
        self.assertIsInstance(data, expected_type)

    @pytest.mark.parametrize("test_observation", [
        {
            "location_id": 1,
            "population_count": 30,
            "habitat_description": "Forest edge",
            "weather_conditions": {"temperature": 25, "humidity": 70}
        },
        {
            "location_id": 2,
            "population_count": 0,
            "habitat_description": "Urban area",
            "weather_conditions": {"temperature": 30, "humidity": 50}
        },
        {
            "location_id": 3,
            "population_count": 100,
            "habitat_description": "Agricultural land",
            "weather_conditions": {"temperature": 22, "humidity": 85}
        }
    ])
    def test_add_observation_endpoint(self, test_observation):
        """Test POST /observations endpoint with various scenarios"""
        test_observation["observation_date"] = datetime.now().isoformat()
        
        start_time = time.time()
        response = self.client.post('/observations',
                                  data=json.dumps(test_observation),
                                  headers=self.headers)
        response_time = time.time() - start_time
        
        self.assertLess(response_time, self.performance_threshold)
        self.assertEqual(response.status_code, 201)
        
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        
        # Verify the observation was added
        new_observation = data[0]
        self.assertEqual(new_observation["population_count"], 
                        test_observation["population_count"])
        self.assertEqual(new_observation["habitat_description"], 
                        test_observation["habitat_description"])

    @pytest.mark.parametrize("test_data", [
        {
            "temperature": 28.5,
            "humidity": 75,
            "rainfall": 12.5,
            "soil_moisture": 0.45,
            "vegetation_index": 0.65
        },
        {
            "temperature": -5.0,  # Edge case: very cold
            "humidity": 30,
            "rainfall": 0,
            "soil_moisture": 0.1,
            "vegetation_index": 0.2
        },
        {
            "temperature": 45.0,  # Edge case: very hot
            "humidity": 95,
            "rainfall": 300,
            "soil_moisture": 0.9,
            "vegetation_index": 0.9
        }
    ])
    def test_environmental_data_endpoint(self, test_data):
        """Test environmental data endpoints with various conditions"""
        test_data["location_id"] = 1
        test_data["timestamp"] = datetime.now().isoformat()
        
        start_time = time.time()
        response = self.client.post('/environmental-data',
                                  data=json.dumps(test_data),
                                  headers=self.headers)
        response_time = time.time() - start_time
        
        self.assertLess(response_time, self.performance_threshold)
        self.assertEqual(response.status_code, 201)
        
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 1)
        
        # Verify environmental data was recorded correctly
        saved_data = data[0]
        for key in test_data.keys():
            if key != "timestamp":  # Timestamp might be reformatted
                self.assertEqual(saved_data[key], test_data[key])

    def test_concurrent_requests(self):
        """Test handling of concurrent requests with performance monitoring"""
        request_count = 10
        max_workers = 3
        
        def make_request():
            start_time = time.time()
            response = self.client.get('/locations', headers=self.headers)
            return response, time.time() - start_time
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(make_request) for _ in range(request_count)]
            results = [future.result() for future in futures]
        
        response_times = [result[1] for result in results]
        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)
        
        logger.info(f"Concurrent requests performance:")
        logger.info(f"Average response time: {avg_response_time:.3f}s")
        logger.info(f"Maximum response time: {max_response_time:.3f}s")
        
        self.assertLess(avg_response_time, self.performance_threshold,
                       "Average response time exceeded threshold")
        
        for response, _ in results:
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            self.assertIsInstance(data, list)

    @patch('swagger_server.utils.supabase_service.SupabaseService')
    def test_service_unavailable(self, mock_supabase):
        """Test handling of Supabase service unavailability with various error scenarios"""
        error_scenarios = [
            Exception("Service unavailable"),
            TimeoutError("Connection timed out"),
            ConnectionError("Network error"),
            ValueError("Invalid data format")
        ]
        
        for error in error_scenarios:
            mock_supabase.get_locations.side_effect = error
            
            start_time = time.time()
            response = self.client.get('/locations', headers=self.headers)
            response_time = time.time() - start_time
            
            self.assertLess(response_time, self.performance_threshold)
            self.assertEqual(response.status_code, 500)
            
            data = json.loads(response.data)
            self.assertIn('error', data)
            self.assertIsInstance(data['error'], str)

if __name__ == '__main__':
    unittest.main()
