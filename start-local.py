import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    print("Installing requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def start_api_server():
    os.chdir("Backend/API")
    subprocess.Popen([sys.executable, "-m", "swagger_server.__main__"])
    os.chdir("../..")

def start_agent_server():
    os.chdir("Backend/Agent")
    subprocess.Popen([sys.executable, "-m", "swagger_server.__main__"])
    os.chdir("../..")

def main():
    # Ensure we're in the project root
    project_root = Path(__file__).parent
    os.chdir(project_root)

    # Install requirements
    install_requirements()

    # Start servers
    start_api_server()
    start_agent_server()

    print("\nServers started successfully!")
    print("API Server running on: http://localhost:8080")
    print("Agent Server running on: http://localhost:8081")
    print("\nPress Ctrl+C to stop the servers")

    try:
        # Keep the script running
        while True:
            pass
    except KeyboardInterrupt:
        print("\nShutting down servers...")

if __name__ == "__main__":
    main()