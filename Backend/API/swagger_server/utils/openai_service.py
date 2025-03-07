
import os
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get API key from environment variable
api_key = os.getenv("OPENAI_KEY")
if not api_key:
    logger.warning("OPENAI_KEY environment variable not set")

# Initialize client
client = OpenAI(api_key=api_key)

def generate_response(prompt, model="gpt-3.5-turbo", temperature=0.7):
    """
    Generate a response using OpenAI's API
    
    Args:
        prompt (str): The prompt to send to OpenAI
        model (str): The model to use
        temperature (float): The temperature parameter for generation
        
    Returns:
        str: The generated response
    """
    try:
        if not api_key:
            return "OpenAI API key not configured", 500
            
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        
        # Extract content from the response
        result = response.choices[0].message.content.strip()
        logger.info(f"Successfully generated response with {model}")
        
        return result
    except Exception as e:
        logger.error(f"OpenAI API error (Prompt: {prompt}): {str(e)}")
        return f"OpenAI API error: {str(e)}", 500
