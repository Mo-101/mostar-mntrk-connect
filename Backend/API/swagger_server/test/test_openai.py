import unittest
from swagger_server.utils.openai_service import generate_response # type: ignore

class TestOpenAI(unittest.TestCase):
    def test_generate_response(self):
        prompt = "Write a short poem about the stars."
        result = generate_response(prompt)
        self.assertTrue(len(result) > 0)

    def test_generate_response_empty_prompt(self):
        prompt = ""
        result = generate_response(prompt)
        self.assertEqual(result[0], "Error generating response")
        self.assertEqual(result[1], 500)

    def test_generate_response_invalid_prompt(self):
        prompt = "Invalid prompt that causes an error"
        result = generate_response(prompt)
        self.assertTrue(len(result) > 0)  # Assuming it returns a valid response even on invalid prompts
