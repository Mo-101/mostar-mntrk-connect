import schedule
import time
from supabase import create_client, Client
import os

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def cleanup_old_metrics():
    try:
        # Archive metrics older than 30 days
        supabase.rpc('archive_old_metrics', {'days_old': 30}).execute()
        print("Old metrics archived successfully")
    except Exception as e:
        print(f"Error archiving old metrics: {e}")

schedule.every().day.at("00:00").do(cleanup_metrics)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Sleep for an hour

