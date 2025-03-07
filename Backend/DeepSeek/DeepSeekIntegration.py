
import requests
import json
import asyncio
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from fastapi import HTTPException
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# 🔹 DeepSeek LLM API Configuration
AI_API_URL = os.getenv("DEEPSEEK_API_URL", "http://172.23.192.1:1234/v1/completions")
MODEL_NAME = os.getenv("DEEPSEEK_MODEL", "deepseek-r1-distill-qwen-7b")
TIMEOUT = int(os.getenv("API_TIMEOUT", "10"))  # Timeout in seconds for API requests

# 🔹 Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 🔹 Logger Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 🔹 Cache to Store Frequent Queries (Reduce API Calls)
CACHE = {}
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))  # Default cache TTL: 1 hour


async def generate_text(prompt: str, max_tokens: int = 50) -> Dict[str, Any]:
    """
    Sends a request to DeepSeek LLM to generate text based on the given prompt.
    
    Args:
        prompt (str): The text prompt for the LLM.
        max_tokens (int): Maximum number of tokens for the response.
    
    Returns:
        Dict[str, Any]: Response from the LLM.
    """
    # 🔹 Check Cache First (Avoid Unnecessary Calls)
    current_time = datetime.now().timestamp()
    if prompt in CACHE and (current_time - CACHE[prompt]['timestamp'] < CACHE_TTL):
        logger.info(f"Cache hit for prompt: {prompt}")
        return CACHE[prompt]['data']

    # 🔹 Prepare Request Payload
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "max_tokens": max_tokens
    }

    try:
        # 🔹 Send API Request to DeepSeek LLM
        response = requests.post(AI_API_URL, json=payload, timeout=TIMEOUT)

        # 🔹 Raise Exception if API Fails
        response.raise_for_status()

        # 🔹 Parse Response
        result = response.json()

        # 🔹 Store in Cache (Reduce API Load)
        CACHE[prompt] = {
            'data': result,
            'timestamp': current_time
        }

        # 🔹 Log Interaction in Supabase
        await log_interaction(prompt, result)

        return result

    except requests.Timeout:
        logger.error("DeepSeek API request timed out.")
        raise HTTPException(status_code=504, detail="DeepSeek API request timed out.")

    except requests.RequestException as e:
        logger.error(f"DeepSeek API request failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Error communicating with DeepSeek LLM.")


async def generate_batch(prompts: List[str], max_tokens: int = 50) -> List[Dict[str, Any]]:
    """
    Process multiple prompts in parallel for batch processing.
    
    Args:
        prompts (List[str]): List of text prompts for the LLM.
        max_tokens (int): Maximum number of tokens for each response.
    
    Returns:
        List[Dict[str, Any]]: List of responses from the LLM.
    """
    tasks = [generate_text(prompt, max_tokens) for prompt in prompts]
    return await asyncio.gather(*tasks)

    
async def log_interaction(prompt: str, response: Dict[str, Any]) -> None:
    """
    Logs AI interactions into Supabase database.
    
    Args:
        prompt (str): User's query.
        response (Dict[str, Any]): AI-generated response.
    
    Returns:
        None
    """
    start_time = datetime.now()
    
    log_entry = {
        "prompt": prompt,
        "response": json.dumps(response),
        "timestamp": datetime.utcnow().isoformat(),
        "processing_time": None  # Will be updated after insertion
    }

    try:
        # 🔹 Insert Log into Supabase Database
        result = supabase.table("ai_logs").insert(log_entry).execute()
        
        # Calculate and update processing time
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        # Update the record with the processing time
        if result.data and len(result.data) > 0:
            record_id = result.data[0]['id']
            supabase.table("ai_logs").update({"processing_time": processing_time}).eq("id", record_id).execute()
        
        logger.info(f"Interaction logged successfully. Processing time: {processing_time}s")

    except Exception as e:
        logger.error(f"Failed to log AI interaction: {str(e)}")


async def get_interaction_history(limit: int = 10) -> List[Dict[str, Any]]:
    """
    Retrieves recent AI interaction history from the database.
    
    Args:
        limit (int): Maximum number of records to retrieve.
    
    Returns:
        List[Dict[str, Any]]: List of recent AI interactions.
    """
    try:
        result = supabase.table("ai_logs").select("*").order("timestamp", desc=True).limit(limit).execute()
        return result.data
    except Exception as e:
        logger.error(f"Failed to retrieve AI interaction history: {str(e)}")
        return []


async def clear_cache() -> None:
    """
    Clears the in-memory cache for AI responses.
    
    Returns:
        None
    """
    global CACHE
    CACHE = {}
    logger.info("Cache cleared successfully.")


if __name__ == "__main__":
    # 🔹 Run Test Query
    test_prompt = "What is the capital of France?"
    asyncio.run(generate_text(test_prompt))
