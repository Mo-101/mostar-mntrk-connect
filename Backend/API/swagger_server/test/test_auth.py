import unittest
from swagger_server.__main__ import app

class TestAuthorization(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_auth_validate(self):
        response = self.app.get('/auth/validate')
        self.assertEqual(response.status_code, 200)
        self.assertIn("Authorization successful", response.json["message"])
