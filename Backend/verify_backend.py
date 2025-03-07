
import requests
import time
import os
import sys

# Color codes for terminal output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

# Configuration
API_BASE_URL = "http://localhost:8080"
AGENT_BASE_URL = "http://localhost:5000"

def print_header(text):
    """Print a formatted header."""
    print(f"\n{BOLD}{GREEN}{'=' * 50}{RESET}")
    print(f"{BOLD}{GREEN}{text.center(50)}{RESET}")
    print(f"{BOLD}{GREEN}{'=' * 50}{RESET}\n")

def print_status(component, status, is_success=True):
    """Print a status message."""
    color = GREEN if is_success else RED
    status_symbol = "✓" if is_success else "✗"
    print(f"{color}{status_symbol} {component}: {status}{RESET}")

def check_api_health():
    """Check if the API server is responding."""
    try:
        response = requests.get(f"{API_BASE_URL}/api", timeout=5)
        if response.status_code == 200:
            print_status("API Server", "Healthy and responding", True)
            return True
        else:
            print_status("API Server", f"Responding with status code {response.status_code}", False)
            return False
    except Exception as e:
        print_status("API Server", f"Not responding: {str(e)}", False)
        return False

def check_agent_health():
    """Check if the Agent server is responding."""
    try:
        response = requests.get(f"{AGENT_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print_status("Agent", "Healthy and responding", True)
            return True
        else:
            print_status("Agent", f"Responding with status code {response.status_code}", False)
            return False
    except Exception as e:
        print_status("Agent", f"Not responding: {str(e)}", False)
        return False

def test_api_endpoints():
    """Test basic API endpoints."""
    print_header("Testing API Endpoints")
    
    endpoints = [
        {"url": "/locations", "method": "GET", "name": "List Locations"},
        {"url": "/observations", "method": "GET", "name": "List Observations"},
        {"url": "/environmental-data", "method": "GET", "name": "Get Environmental Data"}
    ]
    
    success_count = 0
    
    for endpoint in endpoints:
        try:
            if endpoint["method"] == "GET":
                response = requests.get(f"{API_BASE_URL}{endpoint['url']}", timeout=5)
            else:
                print_status(endpoint["name"], "Method not supported for testing", False)
                continue
                
            if response.status_code in [200, 201]:
                print_status(endpoint["name"], f"Success ({response.status_code})", True)
                success_count += 1
            else:
                print_status(endpoint["name"], f"Failed with status {response.status_code}", False)
                
        except Exception as e:
            print_status(endpoint["name"], f"Error: {str(e)}", False)
    
    print(f"\nEndpoint Test Summary: {success_count}/{len(endpoints)} successful")

def verify_database_connection():
    """Verify database connection through the API."""
    print_header("Verifying Database Connection")
    
    try:
        # Try a basic database query through the API
        response = requests.post(
            f"{API_BASE_URL}/postgres-query", 
            json={"query": "SELECT current_timestamp as time"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            if "result" in data and isinstance(data["result"], list) and len(data["result"]) > 0:
                print_status("Database", "Connection successful", True)
                return True
        
        print_status("Database", f"Query failed: {response.text}", False)
        return False
    except Exception as e:
        print_status("Database", f"Connection failed: {str(e)}", False)
        return False

if __name__ == "__main__":
    print_header("Backend Verification")
    
    # First check if services are running
    api_healthy = check_api_health()
    agent_healthy = check_agent_health()
    
    if not api_healthy or not agent_healthy:
        print(f"\n{YELLOW}Some services are not responding. Make sure to run run_backend.py first.{RESET}")
        sys.exit(1)
    
    # Test specific functionality
    test_api_endpoints()
    verify_database_connection()
    
    print_header("Verification Complete")
