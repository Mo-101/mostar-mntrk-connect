import unittest
import pytest
from flask import json
from swagger_server.__main__ import app
import logging
from datetime import datetime
import jwt
import time
from unittest.mock import patch
import re
from bs4 import BeautifulSoup
import html

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TestAPISecurity(unittest.TestCase):
    """Security testing suite for API endpoints"""
    
    def setUp(self):
        self.client = app.test_client()
        self.base_headers = {'Content-Type': 'application/json'}
        self.valid_token = self.generate_token({"user_id": 1, "role": "admin"})
    
    def generate_token(self, payload):
        """Generate JWT token for testing"""
        secret = "test_secret"  # In production, use secure secret from config
        return jwt.encode(payload, secret, algorithm='HS256')
    
    def test_authentication_required(self):
        """Test endpoints require authentication"""
        secure_endpoints = [
            ('GET', '/locations'),
            ('POST', '/observations'),
            ('GET', '/environmental-data'),
            ('POST', '/risk-assessments')
        ]
        
        for method, endpoint in secure_endpoints:
            if method == 'GET':
                response = self.client.get(endpoint, headers=self.base_headers)
            else:
                response = self.client.post(endpoint, headers=self.base_headers)
            
            self.assertEqual(response.status_code, 401,
                           f"Endpoint {method} {endpoint} should require authentication")
    
    def test_invalid_tokens(self):
        """Test various invalid token scenarios"""
        invalid_tokens = [
            "",  # Empty token
            "invalid.token.format",  # Malformed token
            self.generate_token({"exp": time.time() - 3600}),  # Expired token
            self.generate_token({"user_id": "invalid"}),  # Invalid payload
        ]
        
        for token in invalid_tokens:
            headers = {
                **self.base_headers,
                'Authorization': f'Bearer {token}'
            }
            
            response = self.client.get('/locations', headers=headers)
            self.assertEqual(response.status_code, 401,
                           f"Should reject invalid token: {token}")
    
    def test_role_based_access(self):
        """Test role-based access control"""
        role_tests = [
            ("admin", 200),
            ("user", 403),
            ("guest", 403),
            ("invalid_role", 403)
        ]
        
        for role, expected_status in role_tests:
            token = self.generate_token({"user_id": 1, "role": role})
            headers = {
                **self.base_headers,
                'Authorization': f'Bearer {token}'
            }
            
            response = self.client.post('/risk-assessments',
                                      headers=headers,
                                      data=json.dumps({"risk_level": "high"}))
            self.assertEqual(response.status_code, expected_status,
                           f"Unexpected status for role {role}")
    
    def test_rate_limiting(self):
        """Test rate limiting functionality"""
        headers = {
            **self.base_headers,
            'Authorization': f'Bearer {self.valid_token}'
        }
        
        # Make multiple rapid requests
        start_time = time.time()
        responses = []
        
        for _ in range(50):  # Adjust based on rate limit configuration
            response = self.client.get('/locations', headers=headers)
            responses.append(response.status_code)
            
            if 429 in responses:  # Rate limit hit
                break
        
        time_elapsed = time.time() - start_time
        
        # Verify rate limiting behavior
        self.assertIn(429, responses,
                     "Rate limiting should be enforced")
        logger.info(f"Rate limit hit after {len(responses)} requests in {time_elapsed:.2f}s")
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention"""
        injection_attempts = [
            "1; DROP TABLE users;",
            "1 OR 1=1",
            "1' OR '1'='1",
            "1 UNION SELECT * FROM users",
        ]
        
        headers = {
            **self.base_headers,
            'Authorization': f'Bearer {self.valid_token}'
        }
        
        for payload in injection_attempts:
            # Test in query parameters
            response = self.client.get(f'/locations?id={payload}', headers=headers)
            self.assertNotEqual(response.status_code, 500,
                              "SQL injection attempt should not cause server error")
            
            # Test in JSON body
            response = self.client.post('/observations',
                                      headers=headers,
                                      data=json.dumps({"location_id": payload}))
            self.assertNotEqual(response.status_code, 500,
                              "SQL injection attempt should not cause server error")
    
    def test_xss_prevention(self):
        """Test Cross-Site Scripting (XSS) prevention"""
        xss_payloads = [
            "<script>alert('xss')</script>",
            "javascript:alert('xss')",
            "<img src='x' onerror='alert(\"xss\")'>",
            "<svg onload='alert(\"xss\")'>"
        ]
        
        headers = {
            **self.base_headers,
            'Authorization': f'Bearer {self.valid_token}'
        }
        
        for payload in xss_payloads:
            test_data = {
                "habitat_description": payload,
                "location_id": 1,
                "observation_date": datetime.now().isoformat()
            }
            
            response = self.client.post('/observations',
                                      headers=headers,
                                      data=json.dumps(test_data))
            
            if response.status_code == 201:
                data = json.loads(response.data)
                # Check if the payload was sanitized
                self.assertNotIn(payload, str(data),
                               "XSS payload should be sanitized")
                
                # Verify HTML entities are escaped
                if 'habitat_description' in str(data):
                    self.assertNotEqual(
                        str(data).find(payload),
                        -1,
                        "XSS payload should be escaped"
                    )
    
    def test_sensitive_data_exposure(self):
        """Test prevention of sensitive data exposure"""
        headers = {
            **self.base_headers,
            'Authorization': f'Bearer {self.valid_token}'
        }
        
        response = self.client.get('/locations', headers=headers)
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data)
        sensitive_patterns = [
            r'\b[\w\.-]+@[\w\.-]+\.\w+\b',  # Email addresses
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  # Phone numbers
            r'\b\d{3}[-.]?\d{2}[-.]?\d{4}\b',  # SSN-like numbers
            r'password|secret|key|token|credential',  # Sensitive keywords
        ]
        
        for pattern in sensitive_patterns:
            matches = re.findall(pattern, str(data), re.IGNORECASE)
            self.assertEqual(len(matches), 0,
                           f"Found sensitive data matching pattern: {pattern}")
    
    def test_csrf_protection(self):
        """Test CSRF protection"""
        headers = {
            **self.base_headers,
            'Authorization': f'Bearer {self.valid_token}'
        }
        
        # Request without CSRF token
        response = self.client.post('/observations',
                                  headers=headers,
                                  data=json.dumps({"location_id": 1}))
        self.assertIn(response.status_code, [400, 403],
                     "Should reject requests without CSRF token")
        
        # Request with invalid CSRF token
        headers['X-CSRF-Token'] = 'invalid_token'
        response = self.client.post('/observations',
                                  headers=headers,
                                  data=json.dumps({"location_id": 1}))
        self.assertIn(response.status_code, [400, 403],
                     "Should reject requests with invalid CSRF token")

if __name__ == '__main__':
    pytest.main([__file__])
