#!/bin/bash

# Make the script executable
chmod +x dev.sh

# Start the Python backend servers
python start-local.py &

# Start the frontend development server
npm run dev

# Trap Ctrl+C and kill all background processes
trap 'kill $(jobs -p)' EXIT