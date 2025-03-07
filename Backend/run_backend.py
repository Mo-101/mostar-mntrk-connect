
import signal
import sys
from utils.process_manager import ProcessManager

# Process manager instance
manager = ProcessManager()

def signal_handler(sig, frame):
    """Handle interrupt signals."""
    manager.print_header("Shutdown Initiated")
    manager.stop_all_processes()
    sys.exit(0)

if __name__ == "__main__":
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    manager.print_header("Starting Mastomys Natalensis Tracking Backend")
    
    # Check prerequisites
    manager.check_deepseek()
    manager.check_supabase()
    
    # Start components
    manager.processes["API Server"] = manager.start_api_server()
    manager.processes["Agent"] = manager.start_agent()
    
    manager.print_header("Backend Startup Complete")
    
    try:
        # Keep monitoring processes
        manager.monitor_processes()
    except KeyboardInterrupt:
        print("\nShutdown requested...")
    finally:
        manager.stop_all_processes()
