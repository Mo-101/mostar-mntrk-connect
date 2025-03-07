import openai
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_response(prompt, model="gpt-3.5-turbo", temperature=0.7):
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature 
        )
        return response.choices.message.content.strip()
    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI API error (Prompt: {prompt}): {str(e)}")
        return "OpenAI API error", 500  # Or a more specific error code
    except Exception as e:
        logger.error(f"Error generating response (Prompt: {prompt}): {str(e)}")
        return "Error generating response", 500