import subprocess
import time
import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def start_supabase():
    try:
        subprocess.run(["supabase", "start"], check=True)
        print("Supabase services starting...")
    except subprocess.CalledProcessError as e:
        print(f"Error starting Supabase services: {e}")

def check_supabase():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table("system_metrics").select("id").limit(1).execute()
        print("Supabase services are running")
        return True
    except Exception as e:
        print(f"Supabase services are not running: {e}")
        return False

if __name__ == "__main__":
    start_supabase()
    time.sleep(30)  # Wait for services to start
    check_supabase()

