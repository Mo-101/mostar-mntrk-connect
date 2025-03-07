import subprocess
import time
import os

# Define paths
CHAT_SERVER_SCRIPT = "chat_server.py"
LM_STUDIO_URL = "http://192.168.0.103:1234/v1/models"
SUPABASE_PROJECT_REF = "fdezrtfnjsweyoborhwg"

def is_lmstudio_running():
    """Check if LM Studio is running by querying the models endpoint."""
    try:
        import requests
        response = requests.get(LM_STUDIO_URL, timeout=3)
        if response.status_code == 200:
            print("[✔] LM Studio is running.")
            return True
    except Exception:
        pass
    print("[✘] LM Studio is NOT running.")
    return False

def start_lmstudio():
    """Start LM Studio if it's not running."""
    if not is_lmstudio_running():
        print("❗ Please start LM Studio manually.")

def start_chat_server():
    """Start Chat Server."""
    print("[⏳] Starting Chat Server...")
    subprocess.Popen(["python", CHAT_SERVER_SCRIPT], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)
    print("[✔] Chat Server Started.")

def start_supabase():
    """Check and start Supabase Edge Functions (if needed)."""
    print("[⏳] Checking Supabase functions...")
    subprocess.Popen(["supabase", "functions", "serve", "--project-ref", SUPABASE_PROJECT_REF], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(3)
    print("[✔] Supabase Edge Functions Started.")

if __name__ == "__main__":
    print("🚀 Starting all services...\n")

    start_lmstudio()
    start_chat_server()
    start_supabase()

    print("\n✅ All systems operational!")
