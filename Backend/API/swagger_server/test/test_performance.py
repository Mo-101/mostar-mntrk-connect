import time
import psutil
import pytest
from locust import HttpUser, task, between
from flask_testing import TestCase
from swagger_server.__main__ import app
import logging
import json
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APILoadTest(HttpUser):
    """Load testing for API endpoints using Locust"""
    
    wait_time = between(1, 2.5)
    
    def on_start(self):
        """Setup before tests"""
        self.headers = {'Content-Type': 'application/json'}
    
    @task(3)
    def test_get_locations(self):
        """Load test for GET /locations endpoint"""
        with self.client.get("/locations", 
                           headers=self.headers,
                           catch_response=True) as response:
            if response.status_code == 200:
                if response.elapsed.total_seconds() > 2.0:
                    response.failure("Response too slow")
            else:
                response.failure(f"Got status code {response.status_code}")
    
    @task(2)
    def test_get_observations(self):
        """Load test for GET /observations endpoint"""
        with self.client.get("/observations/1",
                           headers=self.headers, 
                           catch_response=True) as response:
            if response.status_code == 200:
                if response.elapsed.total_seconds() > 2.0:
                    response.failure("Response too slow")
            else:
                response.failure(f"Got status code {response.status_code}")
    
    @task(1)
    def test_add_observation(self):
        """Load test for POST /observations endpoint"""
        payload = {
            "location_id": 1,
            "observation_date": datetime.now().isoformat(),
            "population_count": 30,
            "habitat_description": "Test habitat",
            "weather_conditions": {
                "temperature": 25,
                "humidity": 70
            }
        }
        
        with self.client.post("/observations",
                            json=payload,
                            headers=self.headers,
                            catch_response=True) as response:
            if response.status_code == 201:
                if response.elapsed.total_seconds() > 3.0:
                    response.failure("Response too slow")
            else:
                response.failure(f"Got status code {response.status_code}")

class TestAPIPerformance(TestCase):
    """Performance testing suite"""
    
    def create_app(self):
        return app
    
    def setUp(self):
        self.headers = {'Content-Type': 'application/json'}
        self.performance_metrics = {
            'cpu_percent': [],
            'memory_percent': [],
            'response_times': []
        }
    
    def measure_performance(self, func):
        """Measure performance metrics for a function"""
        start_time = time.time()
        start_cpu = psutil.cpu_percent()
        start_memory = psutil.Process().memory_percent()
        
        result = func()
        
        end_time = time.time()
        end_cpu = psutil.cpu_percent()
        end_memory = psutil.Process().memory_percent()
        
        self.performance_metrics['cpu_percent'].append(end_cpu - start_cpu)
        self.performance_metrics['memory_percent'].append(end_memory - start_memory)
        self.performance_metrics['response_times'].append(end_time - start_time)
        
        return result
    
    def test_endpoint_response_times(self):
        """Test response times for critical endpoints"""
        endpoints = [
            ('GET', '/locations'),
            ('GET', '/observations/1'),
            ('GET', '/environmental-data')
        ]
        
        for method, endpoint in endpoints:
            def make_request():
                if method == 'GET':
                    return self.client.get(endpoint, headers=self.headers)
                # Add other methods as needed
            
            response = self.measure_performance(make_request)
            self.assert200(response)
    
    def test_resource_intensive_operation(self):
        """Test resource usage for intensive operations"""
        payload = {
            "location_id": 1,
            "timestamp": datetime.now().isoformat(),
            "temperature": 28.5,
            "humidity": 75,
            "rainfall": 12.5,
            "soil_moisture": 0.45,
            "vegetation_index": 0.65
        }
        
        def make_request():
            return self.client.post('/environmental-data',
                                  data=json.dumps(payload),
                                  headers=self.headers)
        
        # Make multiple requests to measure resource usage
        for _ in range(5):
            response = self.measure_performance(make_request)
            self.assertEqual(response.status_code, 201)
        
        # Analyze performance metrics
        avg_response_time = sum(self.performance_metrics['response_times']) / len(self.performance_metrics['response_times'])
        max_cpu_usage = max(self.performance_metrics['cpu_percent'])
        max_memory_usage = max(self.performance_metrics['memory_percent'])
        
        logger.info(f"Performance Metrics:")
        logger.info(f"Average Response Time: {avg_response_time:.3f}s")
        logger.info(f"Max CPU Usage: {max_cpu_usage:.1f}%")
        logger.info(f"Max Memory Usage: {max_memory_usage:.1f}%")
        
        # Assert performance thresholds
        self.assertLess(avg_response_time, 2.0, "Average response time too high")
        self.assertLess(max_cpu_usage, 80.0, "CPU usage too high")
        self.assertLess(max_memory_usage, 75.0, "Memory usage too high")
    
    def test_concurrent_performance(self):
        """Test performance under concurrent load"""
        import concurrent.futures
        
        def make_request():
            return self.client.get('/locations', headers=self.headers)
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            start_time = time.time()
            futures = [executor.submit(make_request) for _ in range(10)]
            responses = [future.result() for future in futures]
            total_time = time.time() - start_time
        
        # Verify responses and measure performance
        for response in responses:
            self.assert200(response)
        
        avg_time_per_request = total_time / len(responses)
        logger.info(f"Concurrent Performance:")
        logger.info(f"Total Time: {total_time:.3f}s")
        logger.info(f"Average Time per Request: {avg_time_per_request:.3f}s")
        
        self.assertLess(avg_time_per_request, 1.0, 
                       "Average time per request too high under concurrent load")

if __name__ == '__main__':
    pytest.main([__file__])
