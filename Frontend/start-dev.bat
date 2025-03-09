
@echo off
echo Starting the Mastomys Natalensis Tracking System...

:: Start the backend servers in a new window
echo Starting backend servers...
start cmd /k "cd Backend && python run_backend.py"

:: Wait a moment for backend to initialize
timeout /t 2 > nul

:: Start the frontend
echo Starting frontend...
npm run dev

echo When done, make sure to close all command windows to stop the servers.
