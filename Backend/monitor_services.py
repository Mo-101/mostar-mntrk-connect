import os
import time
import requests
import subprocess
from supabase import create_client, Client

# Configuration
DEEPSEEK_URL = "http://localhost:5005/health"
DEEPSEEK_CMD = "python -m deepseek.server --port 5005 --model-path /models/deepseek-llm"
SUPABASE_CMD = "supabase start"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def check_deepseek():
    try:
        response = requests.get(DEEPSEEK_URL, timeout=5)
        return response.status_code == 200 and response.json().get("status") == "running"
    except requests.exceptions.RequestException:
        return False

def check_supabase():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        supabase.table("system_metrics").select("id").limit(1).execute()
        return True
    except Exception:
        return False

def restart_service(service_name, restart_command):
    print(f"Restarting {service_name}...")
    subprocess.run(restart_command, shell=True, check=True)
    time.sleep(30)  # Wait for the service to restart

def monitor_services():
    while True:
        if not check_deepseek():
            print("DeepSeek LLM is down. Attempting to restart...")
            restart_service("DeepSeek LLM", DEEPSEEK_CMD)
        
        if not check_supabase():
            print("Supabase services are down. Attempting to restart...")
            restart_service("Supabase", SUPABASE_CMD)
        
        time.sleep(60)  # Check every 60 seconds

if __name__ == "__main__":
    monitor_services()

