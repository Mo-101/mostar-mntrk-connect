from api import create_app

if __name__ == '__main__':
    print("\nStarting API server...")
    print("Available routes:")
    print("  GET  /api      - Show API information")
    print("  GET  /api/test - Test the API")
    print("  POST /api/chat - Send a chat message")
    print("\nPress Ctrl+C to quit")
    
    app = create_app()
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=True  # Enable debug mode for development
    )
