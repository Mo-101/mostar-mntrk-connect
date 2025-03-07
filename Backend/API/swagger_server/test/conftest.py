import pytest
from swagger_server.__main__ import app
import jwt
import logging
from datetime import datetime, timedelta
from unittest.mock import MagicMock
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def client():
    """Test client fixture"""
    return app.test_client()

@pytest.fixture
def auth_headers():
    """Authentication headers fixture"""
    def _auth_headers(role="admin"):
        token = jwt.encode(
            {
                "user_id": 1,
                "role": role,
                "exp": datetime.utcnow() + timedelta(hours=1)
            },
            "test_secret",
            algorithm="HS256"
        )
        return {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
    return _auth_headers

@pytest.fixture
def mock_supabase():
    """Mock Supabase service fixture"""
    mock = MagicMock()
    
    # Mock common database operations
    mock.get_locations.return_value = [
        {
            "id": 1,
            "name": "Test Location 1",
            "coordinates": {"lat": 8.4, "lng": -11.7},
            "habitat_type": "forest"
        },
        {
            "id": 2,
            "name": "Test Location 2",
            "coordinates": {"lat": 12.1, "lng": -15.3},
            "habitat_type": "urban"
        }
    ]
    
    mock.get_observations.return_value = [
        {
            "id": 1,
            "location_id": 1,
            "observation_date": datetime.now().isoformat(),
            "population_count": 30
        }
    ]
    
    return mock

@pytest.fixture
def test_data():
    """Test data fixture"""
    return {
        "locations": [
            {
                "id": 1,
                "name": "Test Location 1",
                "coordinates": {"lat": 8.4, "lng": -11.7},
                "habitat_type": "forest"
            },
            {
                "id": 2,
                "name": "Test Location 2",
                "coordinates": {"lat": 12.1, "lng": -15.3},
                "habitat_type": "urban"
            }
        ],
        "observations": [
            {
                "id": 1,
                "location_id": 1,
                "observation_date": datetime.now().isoformat(),
                "population_count": 30,
                "habitat_description": "Dense forest edge",
                "weather_conditions": {
                    "temperature": 25,
                    "humidity": 70
                }
            }
        ],
        "environmental_data": [
            {
                "id": 1,
                "location_id": 1,
                "timestamp": datetime.now().isoformat(),
                "temperature": 28.5,
                "humidity": 75,
                "rainfall": 12.5,
                "soil_moisture": 0.45,
                "vegetation_index": 0.65
            }
        ]
    }

@pytest.fixture
def mock_responses():
    """Mock API response fixture"""
    def _create_response(status_code=200, data=None):
        return {
            "status_code": status_code,
            "data": data or {},
            "headers": {'Content-Type': 'application/json'}
        }
    return _create_response

@pytest.fixture
def performance_threshold():
    """Performance threshold fixture"""
    return {
        "response_time": 2.0,  # seconds
        "cpu_usage": 80.0,     # percent
        "memory_usage": 75.0,  # percent
        "concurrent_requests": 10
    }

class MockResponse:
    """Mock response class for testing"""
    def __init__(self, status_code=200, data=None, headers=None):
        self.status_code = status_code
        self.data = json.dumps(data if data is not None else {})
        self.headers = headers if headers is not None else {}

@pytest.fixture
def mock_http_response():
    """HTTP response mock fixture"""
    def _create_mock_response(status_code=200, data=None, headers=None):
        return MockResponse(status_code, data, headers)
    return _create_mock_response

@pytest.fixture
def error_scenarios():
    """Error scenario fixture"""
    return [
        ("invalid_token", 401, "Invalid authentication token"),
        ("expired_token", 401, "Token has expired"),
        ("insufficient_permissions", 403, "Insufficient permissions"),
        ("resource_not_found", 404, "Resource not found"),
        ("rate_limit_exceeded", 429, "Rate limit exceeded"),
        ("server_error", 500, "Internal server error")
    ]

@pytest.fixture
def test_observation_data():
    """Test observation data fixture"""
    return [
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
    ]

@pytest.fixture
def security_test_data():
    """Security test data fixture"""
    return {
        "sql_injection_attempts": [
            "1; DROP TABLE users;",
            "1 OR 1=1",
            "1' OR '1'='1",
            "1 UNION SELECT * FROM users"
        ],
        "xss_payloads": [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src='x' onerror='alert(\"xss\")'>",
            "<svg onload='alert(\"xss\")'>"
        ],
        "sensitive_patterns": [
            r'\b[\w\.-]+@[\w\.-]+\.\w+\b',  # Email addresses
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  # Phone numbers
            r'\b\d{3}[-.]?\d{2}[-.]?\d{4}\b',  # SSN-like numbers
            r'password|secret|key|token|credential'  # Sensitive keywords
        ]
    }
