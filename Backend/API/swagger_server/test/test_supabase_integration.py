import unittest
from swagger_server.utils.supabase_service import SupabaseService
from datetime import datetime, timedelta
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestSupabaseIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        try:
            cls.supabase = SupabaseService()
            logger.info("Supabase service initialized for testing")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase service: {str(e)}")
            raise

    def test_get_locations(self):
        """Test fetching locations"""
        result = self.supabase.get_locations()
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        if result["data"]:
            self.assertIn("name", result["data"][0])
            self.assertIn("latitude", result["data"][0])
            self.assertIn("longitude", result["data"][0])

    def test_get_observations(self):
        """Test fetching observations"""
        result = self.supabase.get_observations()
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        if result["data"]:
            self.assertIn("location_id", result["data"][0])
            self.assertIn("observation_date", result["data"][0])
            self.assertIn("population_count", result["data"][0])

    def test_get_environmental_data(self):
        """Test fetching environmental data"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        result = self.supabase.get_environmental_data(
            start_date=start_date,
            end_date=end_date
        )
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        if result["data"]:
            self.assertIn("temperature", result["data"][0])
            self.assertIn("humidity", result["data"][0])
            self.assertIn("rainfall", result["data"][0])

    def test_get_risk_assessments(self):
        """Test fetching risk assessments"""
        result = self.supabase.get_risk_assessments()
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        if result["data"]:
            self.assertIn("risk_level", result["data"][0])
            self.assertIn("factors", result["data"][0])
            self.assertIn("mitigation_measures", result["data"][0])

    def test_add_and_update_observation(self):
        """Test adding a new observation"""
        test_data = {
            "location_id": 1,
            "observation_date": datetime.now().isoformat(),
            "population_count": 25,
            "habitat_description": "Test habitat",
            "weather_conditions": {"temperature": 25, "humidity": 70},
            "status": "pending"
        }
        
        # Add observation
        result = self.supabase.add_observation(test_data)
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        self.assertEqual(len(result["data"]), 1)
        
        # Verify the added observation
        observation_id = result["data"][0]["id"]
        observations = self.supabase.get_observations()
        self.assertTrue(any(obs["id"] == observation_id for obs in observations["data"]))

    def test_location_summary(self):
        """Test getting location summary"""
        # Get first location
        locations = self.supabase.get_locations()
        if not locations["data"]:
            self.skipTest("No locations available for testing")
            
        location_id = locations["data"][0]["id"]
        result = self.supabase.get_location_summary(location_id)
        
        self.assertTrue(result["success"])
        self.assertIn("latest_observation", result["data"])
        self.assertIn("latest_environmental_data", result["data"])
        self.assertIn("latest_risk_assessment", result["data"])

    def test_add_environmental_data(self):
        """Test adding environmental data"""
        test_data = {
            "location_id": 1,
            "timestamp": datetime.now().isoformat(),
            "temperature": 28.5,
            "humidity": 75,
            "rainfall": 12.5,
            "soil_moisture": 0.45,
            "vegetation_index": 0.65
        }
        
        result = self.supabase.add_environmental_data(test_data)
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        self.assertEqual(len(result["data"]), 1)
        
        # Verify the added data
        env_data_id = result["data"][0]["id"]
        env_data = self.supabase.get_environmental_data()
        self.assertTrue(any(data["id"] == env_data_id for data in env_data["data"]))

    def test_update_risk_assessment(self):
        """Test updating risk assessment"""
        # First get an existing risk assessment
        risk_assessments = self.supabase.get_risk_assessments()
        if not risk_assessments["data"]:
            self.skipTest("No risk assessments available for testing")
            
        assessment_id = risk_assessments["data"][0]["id"]
        update_data = {
            "risk_level": "high",
            "factors": {"population_density": "increased", "habitat_suitability": "high"},
            "mitigation_measures": ["Immediate action required", "Increase monitoring frequency"]
        }
        
        result = self.supabase.update_risk_assessment(assessment_id, update_data)
        self.assertTrue(result["success"])
        self.assertIsInstance(result["data"], list)
        self.assertEqual(len(result["data"]), 1)
        self.assertEqual(result["data"][0]["risk_level"], "high")

if __name__ == '__main__':
    unittest.main()
