import psutil
import time
from supabase import create_client, Client
import os

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def collect_metrics():
    cpu = psutil.cpu_percent(interval=1)
    ram = psutil.virtual_memory().percent
    net_io = psutil.net_io_counters()
    return {
        "timestamp": time.time(),
        "cpu_usage": cpu,
        "ram_usage": ram,
        "network_in": net_io.bytes_recv,
        "network_out": net_io.bytes_sent
    }

def store_metrics(metrics):
    supabase.table("system_metrics").insert(metrics).execute()

def check_alerts(metrics):
    if metrics["cpu_usage"] > 90:
        # Implement alert logic here
        pass

def main():
    while True:
        metrics = collect_metrics()
        store_metrics(metrics)
        check_alerts(metrics)
        time.sleep(5)

if __name__ == "__main__":
    main()

