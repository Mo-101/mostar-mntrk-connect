
#!/bin/bash

# Make this script executable
chmod +x start-dev.sh

echo "Starting the Mastomys Natalensis Tracking System..."

# Start the backend servers in the background
echo "Starting backend servers..."
cd Backend && python run_backend.py &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 2

# Start the frontend
echo "Starting frontend..."
npm run dev

# When the frontend process ends (Ctrl+C), also kill the backend
kill $BACKEND_PID
echo "All services stopped."
