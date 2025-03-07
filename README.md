
# Mastomys Natalensis Tracking System

This application provides tools for tracking Mastomys Natalensis populations, analyzing ecological trends, and supporting Lassa fever outbreak management.

## Project Structure

The application consists of:

- **Frontend**: React application with Cesium map integration
- **Backend**: Multiple Python services including an API server, agent server, and AI integration

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python 3.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd Backend
   pip install -r requirements.txt
   cd ..
   ```

### Running the Application

#### Option 1: Using the provided scripts

On Linux/Mac:
```
./start-dev.sh
```

On Windows:
```
start-dev.bat
```

#### Option 2: Manual startup

1. Start the backend servers:
   ```
   cd Backend
   python run_backend.py
   ```

2. In a new terminal, start the frontend:
   ```
   npm run dev
   ```

3. The application should be available at http://localhost:5173 by default

### Environment Setup

Make sure all the required environment variables are set correctly:

1. Supabase configuration
2. API configuration
3. OpenAI configuration
4. Weather API configuration
5. Cesium configuration

Refer to `.env.example` for a list of required variables.

## Features

- 3D visualization of tracking data
- Real-time wind pattern analysis
- AI-powered risk assessment
- Weather and environmental condition monitoring
- Training interface for machine learning models

## Backend Services

The backend consists of multiple services:

- **API Server**: Handles main application endpoints
- **Agent Server**: Processes agent-specific operations
- **DeepSeek Integration**: Provides AI language model capabilities

For more detailed information, see `Backend/README.md`.
