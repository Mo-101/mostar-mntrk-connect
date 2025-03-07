import subprocess
import time
import os

def run_command(command, description):
    print(f"Running: {description}")
    try:
        subprocess.run(command, shell=True, check=True)
        print(f"Successfully completed: {description}")
    except subprocess.CalledProcessError as e:
        print(f"Error during {description}: {e}")
        return False
    return True

def main():
    steps = [
        ("supabase start", "Start Supabase"),
        ("python -m deepseek.server --port 5005 --model-path /models/deepseek-llm", "Start DeepSeek LLM"),
        ("curl http://localhost:5005/health", "Check DeepSeek LLM Health"),
        ("python verify_connectivity.py", "Verify API Connectivity"),
        ("nohup python monitor_services.py &", "Run Monitoring Script")
    ]

    for command, description in steps:
        if not run_command(command, description):
            print("Deployment failed. Please check the errors above.")
            return

    print("Deployment completed successfully!")

if __name__ == "__main__":
    main()

