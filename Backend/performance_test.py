import asyncio
import aiohttp
import time

async def make_request(session, url, headers):
    start_time = time.time()
    async with session.post(url, headers=headers, json={"prompt": "Test prompt"}) as response:
        await response.text()
    end_time = time.time()
    return end_time - start_time

async def run_performance_test(num_requests):
    url = "http://localhost:8000/ai/generate"
    headers = {"Authorization": "your_test_token_here"}

    async with aiohttp.ClientSession() as session:
        tasks = [make_request(session, url, headers) for _ in range(num_requests)]
        response_times = await asyncio.gather(*tasks)

    avg_response_time = sum(response_times) / len(response_times)
    requests_per_second = num_requests / sum(response_times)
    p99_response_time = sorted(response_times)[int(0.99 * num_requests)]

    print(f"Average response time: {avg_response_time:.3f} seconds")
    print(f"Requests per second: {requests_per_second:.2f}")
    print(f"P99 response time: {p99_response_time:.3f} seconds")

if __name__ == "__main__":
    asyncio.run(run_performance_test(1000))

