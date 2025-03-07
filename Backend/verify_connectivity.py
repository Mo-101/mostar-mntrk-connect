import requests
import os
from supabase import create_client, Client

DEEPSEEK_URL = "http://localhost:5005/generate"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def test_deepseek():
    try:
        response = requests.post(DEEPSEEK_URL, json={"prompt": "Test AI Integration"})
        print("DeepSeek Response:", response.json())
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to DeepSeek: {e}")
        return False

def test_supabase():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table("system_metrics").select("*").limit(1).execute()
        print("Supabase Response:", response.data)
        return True
    except Exception as e:
        print(f"Error connecting to Supabase: {e}")
        return False

if __name__ == "__main__":
    deepseek_status = test_deepseek()
    supabase_status = test_supabase()
    
    if deepseek_status and supabase_status:
        print("All services are connected and running correctly")
    else:
        print("Some services are not running or not connected properly")

