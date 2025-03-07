
import subprocess
import time
import os
import psutil
import signal
import sys

# Color codes for terminal output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

class ProcessManager:
    """Handle the starting, stopping and monitoring of backend services."""
    
    def __init__(self):
        self.processes = {}
        
    def print_header(self, text):
        """Print a formatted header."""
        print(f"\n{BOLD}{GREEN}{'=' * 50}{RESET}")
        print(f"{BOLD}{GREEN}{text.center(50)}{RESET}")
        print(f"{BOLD}{GREEN}{'=' * 50}{RESET}\n")

    def print_status(self, component, status, is_success=True):
        """Print a status message."""
        color = GREEN if is_success else RED
        status_symbol = "✓" if is_success else "✗"
        print(f"{color}{status_symbol} {component}: {status}{RESET}")

    def is_port_in_use(self, port):
        """Check if a port is already in use."""
        for proc in psutil.process_iter(['pid', 'name', 'connections']):
            try:
                for conn in proc.connections():
                    if conn.laddr.port == port and conn.status == 'LISTEN':
                        return True
            except (psutil.AccessDenied, psutil.NoSuchProcess):
                pass
        return False

    def start_api_server(self, api_port=8080):
        """Start the API server."""
        self.print_status("API Server", "Starting...", True)
        
        # Check if port is already in use
        if self.is_port_in_use(api_port):
            self.print_status("API Server", f"Port {api_port} already in use. Skipping.", False)
            return None
        
        # Set working directory to API folder
        api_dir = os.path.join("Backend", "API")
        
        # Command to start the API server
        cmd = [sys.executable, "-m", "swagger_server"]
        
        # Start the process
        process = subprocess.Popen(
            cmd,
            cwd=api_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        # Wait for the server to start
        time.sleep(3)
        
        # Check if process is running
        if process.poll() is None:
            self.print_status("API Server", f"Running on port {api_port}", True)
            return process
        else:
            stdout, stderr = process.communicate()
            self.print_status("API Server", f"Failed to start: {stderr}", False)
            return None

    def start_agent(self, agent_port=5000):
        """Start the Agent server."""
        self.print_status("Agent", "Starting...", True)
        
        # Check if port is already in use
        if self.is_port_in_use(agent_port):
            self.print_status("Agent", f"Port {agent_port} already in use. Skipping.", False)
            return None
        
        # Set working directory to Agent folder
        agent_dir = os.path.join("Backend", "Agent")
        
        # Command to start the Agent
        cmd = [sys.executable, "basic_server.py"]
        
        # Start the process
        process = subprocess.Popen(
            cmd,
            cwd=agent_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        # Wait for the server to start
        time.sleep(3)
        
        # Check if process is running
        if process.poll() is None:
            self.print_status("Agent", f"Running on port {agent_port}", True)
            return process
        else:
            stdout, stderr = process.communicate()
            self.print_status("Agent", f"Failed to start: {stderr}", False)
            return None

    def check_deepseek(self, lm_studio_url="http://localhost:1234/v1/models"):
        """Check if DeepSeek is running."""
        import requests
        
        self.print_status("DeepSeek", "Checking...", True)
        
        try:
            response = requests.get(lm_studio_url, timeout=3)
            if response.status_code == 200:
                self.print_status("DeepSeek", "LM Studio is running and available", True)
                return True
            else:
                self.print_status("DeepSeek", f"LM Studio responded with status code {response.status_code}", False)
                return False
        except Exception as e:
            self.print_status("DeepSeek", f"LM Studio not available: {str(e)}", False)
            print(f"{YELLOW}Please start LM Studio manually to enable AI functionality{RESET}")
            return False

    def check_supabase(self, project_ref="fdezrtfnjsweyoborhwg"):
        """Check Supabase connection."""
        self.print_status("Supabase", "Checking connection...", True)
        
        # Check environment variables
        if not os.environ.get("SUPABASE_URL") or not os.environ.get("SUPABASE_KEY"):
            # Load from variables in this file if not in environment
            os.environ["SUPABASE_URL"] = f"https://{project_ref}.supabase.co"
            os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZXpydGZuanN3ZXlvYm9yaHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwOTkwMzAsImV4cCI6MjA0ODY3NTAzMH0.Eaqr65G0feAYC0y4aWD_9HoGDRdrTCuXYuNgLoAQ9-c"
        
        # This is a simple validation, not an actual connection test
        if "https://" in os.environ.get("SUPABASE_URL", "") and os.environ.get("SUPABASE_KEY", "").startswith("eyJ"):
            self.print_status("Supabase", "Configuration looks valid", True)
            return True
        else:
            self.print_status("Supabase", "Invalid configuration", False)
            return False

    def stop_all_processes(self):
        """Stop all running processes."""
        self.print_header("Stopping Services")
        
        for name, process in self.processes.items():
            if process and process.poll() is None:
                self.print_status(name, "Stopping...", True)
                process.terminate()
                try:
                    process.wait(timeout=5)
                    self.print_status(name, "Stopped", True)
                except subprocess.TimeoutExpired:
                    process.kill()
                    self.print_status(name, "Killed after timeout", False)

    def monitor_processes(self):
        """Monitor running processes and restart if needed."""
        while True:
            for name, process in list(self.processes.items()):
                if process and process.poll() is not None:
                    self.print_status(name, f"Process died with code {process.poll()}", False)
                    stdout, stderr = process.communicate()
                    if stderr:
                        print(f"{RED}Error output: {stderr}{RESET}")
                    
                    self.print_status(name, "Restarting...", True)
                    
                    # Restart the process
                    if name == "API Server":
                        self.processes[name] = self.start_api_server()
                    elif name == "Agent":
                        self.processes[name] = self.start_agent()
            
            time.sleep(10)
