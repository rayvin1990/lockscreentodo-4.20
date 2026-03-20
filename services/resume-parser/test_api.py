"""
Resume Parser API - Test Script
测试API端点和WebSocket连接
"""

import asyncio
import websockets
import requests
import json
import sys
from pathlib import Path


API_BASE_URL = "http://localhost:8000"
WS_BASE_URL = "ws://localhost:8000"


def test_health_check():
    """测试健康检查端点"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_upload_resume(file_path: str, user_id: str = "test-user"):
    """测试文件上传"""
    print("\n=== Testing Resume Upload ===")
    try:
        with open(file_path, 'rb') as f:
            files = {'file': (Path(file_path).name, f, 'application/octet-stream')}
            data = {'user_id': user_id}

            response = requests.post(f"{API_BASE_URL}/api/upload", files=files, data=data)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {json.dumps(response.json(), indent=2)}")

            if response.status_code == 200:
                return response.json()['task_id']
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def test_get_task_status(task_id: str):
    """测试查询任务状态"""
    print("\n=== Testing Get Task Status ===")
    try:
        response = requests.get(f"{API_BASE_URL}/api/tasks/{task_id}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


async def test_websocket(task_id: str):
    """测试WebSocket连接"""
    print("\n=== Testing WebSocket Connection ===")
    uri = f"{WS_BASE_URL}/ws/{task_id}"

    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connected to {uri}")
            print("Listening for messages (press Ctrl+C to stop)...")

            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=30)
                    data = json.loads(message)

                    if data['type'] == 'log':
                        print(f"[{data['level'].upper()}] {data['message']}")
                    elif data['type'] == 'status':
                        print(f"\nStatus: {data['status']}")
                        print(f"Progress: {data['progress'] * 100:.1f}%")
                        print(f"Message: {data['message']}")

                        if data['status'] == 'completed':
                            print("\n✓ Parsing completed!")
                            print("\nParsed Data:")
                            print(json.dumps(data.get('result', {}), indent=2))
                            break
                        elif data['status'] == 'failed':
                            print(f"\n✗ Parsing failed: {data['message']}")
                            break

                except asyncio.TimeoutError:
                    print("\nTimeout waiting for messages")
                    break
                except KeyboardInterrupt:
                    print("\nStopped by user")
                    break

    except Exception as e:
        print(f"WebSocket Error: {e}")
        return False

    return True


def test_list_tasks(user_id: str = "test-user"):
    """测试列出任务"""
    print("\n=== Testing List Tasks ===")
    try:
        response = requests.get(f"{API_BASE_URL}/api/tasks", params={'user_id': user_id, 'limit': 10})
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Total tasks: {result['total']}")
        print(f"Tasks: {json.dumps(result['tasks'], indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


async def run_full_test(file_path: str):
    """运行完整的测试流程"""
    print("=" * 50)
    print("Resume Parser API - Full Test")
    print("=" * 50)

    # 1. Health check
    if not test_health_check():
        print("\n✗ Health check failed. Is the server running?")
        return

    # 2. Upload file
    task_id = test_upload_resume(file_path)
    if not task_id:
        print("\n✗ Upload failed")
        return

    print(f"\n✓ File uploaded successfully. Task ID: {task_id}")

    # 3. Get task status
    test_get_task_status(task_id)

    # 4. Connect to WebSocket
    await test_websocket(task_id)

    # 5. List tasks
    test_list_tasks()

    print("\n" + "=" * 50)
    print("Test completed!")
    print("=" * 50)


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("Usage: python test_api.py <path_to_resume_file>")
        print("\nExample:")
        print("  python test_api.py resume.pdf")
        print("  python test_api.py test_files/sample_resume.png")
        sys.exit(1)

    file_path = sys.argv[1]

    if not Path(file_path).exists():
        print(f"Error: File not found: {file_path}")
        sys.exit(1)

    # Run async test
    asyncio.run(run_full_test(file_path))


if __name__ == "__main__":
    main()
