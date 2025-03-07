def start_deepseek():
    try:
        subprocess.Popen(["python", "-m", "deepseek.server", "--port", str(DEEPSEEK_PORT), "--model-path", "/models/deepseek-llm", "--device", "cuda"])
        print("DeepSeek LLM server started with GPU support")
    except Exception as e:
        print(f"Error starting DeepSeek LLM server: {e}")

