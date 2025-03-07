import subprocess
import requests
import time

DEEPSEEK_PORT = 5005
DEEPSEEK_MODEL_PATH = "/models/deepseek-llm"

def start_deepseek():
    try:
        subprocess.Popen(["python", "-m", "deepseek.server", "--port", str(DEEPSEEK_PORT), "--model-path", DEEPSEEK_MODEL_PATH])
        print("DeepSeek LLM server starting...")
    except Exception as e:
        print(f"Error starting DeepSeek LLM server: {e}")

def check_deepseek():
    try:
        response = requests.get(f"http://localhost:{DEEPSEEK_PORT}/health")
        if response.status_code == 200 and response.json().get("status") == "running":
            print("DeepSeek LLM server is running")
            return True
        else:
            print("DeepSeek LLM server is not running")
            return False
    except requests.exceptions.RequestException:
        print("DeepSeek LLM server is not responding")
        return False

if __name__ == "__main__":
    start_deepseek()
    time.sleep(10)  # Wait for the server to start
    check_deepseek()

