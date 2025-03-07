# Backend System Architecture

## Overview
The backend system consists of multiple microservices working together to provide AI-powered tracking functionality. The system uses a ProcessManager for orchestrating and monitoring services, ensuring robust operation and automatic recovery from failures.

```mermaid
graph TD
    PM[Process Manager] --> API[API Server :8080]
    PM --> Agent[Agent Server :5000]
    PM --> DS[DeepSeek/LM Studio :1234]
    PM --> SB[Supabase Cloud]
    Agent --> CS[Chat Server]
    
    style PM fill:#f9f,stroke:#333,stroke-width:2px
    style API fill:#bbf,stroke:#333,stroke-width:2px
    style Agent fill:#bbf,stroke:#333,stroke-width:2px
    style DS fill:#bfb,stroke:#333,stroke-width:2px
    style SB fill:#fbb,stroke:#333,stroke-width:2px
    style CS fill:#bbf,stroke:#333,stroke-width:2px
```

## Core Services

### 1. API Server (Port 8080)
- Swagger/OpenAPI-based REST API
- Handles main application endpoints
- Located in: `Backend/API/`
- Started via: `swagger_server` module

### 2. Agent Server (Port 5000)
- Flask-based service
- Handles agent-specific operations
- Located in: `Backend/Agent/`
- Started via: `basic_server.py`

### 3. DeepSeek/LM Studio (Port 1234)
- AI/ML component using DeepSeek LLM
- Must be started manually
- Default endpoint: `http://127.0.0.1:1234/v1/completions`
- Default model: `deepseek-r1-distill-qwen-7b`
- Features:
  - Request caching with configurable TTL
  - Interaction logging to Supabase
  - Batch processing support
  - Error handling and timeouts

### 4. Supabase Integration
- Cloud-based database service
- Handles data persistence
- Project Reference: `fdezrtfnjsweyoborhwg`
- Edge Functions support

### 5. Chat Server
- Flask-based chat service
- Started via: `chat_server.py`
- Endpoints:
  - POST `/chat` - Main chat interaction endpoint
  - POST `/test` - Test endpoint for connectivity
- Features:
  - Direct integration with LM Studio
  - JSON request/response format
  - Configurable token limits
  - Detailed error handling
  - Request logging

## Configuration Requirements

### Environment Variables
```env
# Server Configuration
PORT=5000

# DeepSeek AI Configuration
DEEPSEEK_API_URL=http://127.0.0.1:1234/v1/completions
DEEPSEEK_MODEL=deepseek-r1-distill-qwen-7b
API_TIMEOUT=10
CACHE_TTL=3600

# Supabase Configuration
SUPABASE_URL=https://fdezrtfnjsweyoborhwg.supabase.co
SUPABASE_KEY=<your-supabase-key>
SUPABASE_SERVICE_ROLE=<your-service-role-key>

# Redis Configuration (optional)
# REDIS_URL=redis://username:password@localhost:6379
```

### Service Ports
- API Server: 8080
- Agent Server: 5000 (configurable via PORT env variable)
- DeepSeek/LM Studio: 1234 (accessed via http://127.0.0.1:1234/v1/completions)

### Timeouts and Caching
- API Timeout: 10 seconds (configurable via API_TIMEOUT)
- Cache TTL: 3600 seconds/1 hour (configurable via CACHE_TTL)
- In-memory caching system for frequent queries
- Cache can be cleared programmatically

### Data Logging
- AI interactions are logged to Supabase
- Log entries include:
  - Prompt
  - Response
  - Timestamp
  - Processing time
- Historical interaction data can be retrieved

## Startup Procedure

1. **Prerequisites Check**
   ```bash
   # Start LM Studio manually first
   # Ensure Supabase credentials are configured
   ```

2. **Start All Services**
   ```bash
   python run_all.py
   ```
   
   Or start individual components:
   ```bash
   python run_backend.py  # Starts API and Agent servers
   ```

3. **Verify Services**
   - API Server should be accessible at `http://localhost:8080`
   - Agent Server should be accessible at `http://localhost:5000`
   - LM Studio should be accessible at `http://localhost:1234`

## Process Management

The system uses a ProcessManager class (`utils/process_manager.py`) that provides:

- Automated process monitoring
- Service health checks
- Automatic restart of failed services
- Graceful shutdown handling
- Status reporting with colored console output

### Monitoring Features
- Port availability checking
- Process status monitoring
- Error logging
- Automatic service recovery

## Shutdown Procedure

The system handles graceful shutdown through:
- Signal handlers (SIGINT, SIGTERM)
- Process termination with timeout
- Resource cleanup

To shut down:
1. Press Ctrl+C in the terminal running the services
2. The ProcessManager will handle graceful shutdown of all services
3. Verify all processes have terminated

## Troubleshooting

Common issues and solutions:

1. **Port Already in Use**
   - The system will automatically detect and report port conflicts
   - Check for existing processes using: `netstat -ano | findstr :<PORT>`

2. **Service Fails to Start**
   - Check the console output for error messages
   - Verify all prerequisites are running
   - Check log files in respective service directories

3. **LM Studio Connection Issues**
   - Ensure LM Studio is running manually
   - Verify the correct URL configuration
   - Check network connectivity

## Development Guidelines

When extending the system:

1. Add new services to ProcessManager
2. Implement proper shutdown handlers
3. Add appropriate health checks
4. Update configuration documentation
5. Follow existing logging patterns

## Security Considerations

- Supabase keys should be kept secure
- Local services run on localhost only
- Proper error handling prevents information leakage
- Environment variables used for sensitive configuration
