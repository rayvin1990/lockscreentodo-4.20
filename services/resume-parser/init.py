"""
Resume Parser API - Initialization Script
一键初始化脚本，用于设置和验证环境
"""

import os
import sys
import subprocess
from pathlib import Path


def print_header(text):
    """打印标题"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")


def print_step(step, text):
    """打印步骤"""
    print(f"[{step}] {text}")


def check_python_version():
    """检查Python版本"""
    print_step(1, "Checking Python version...")
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print(f"  ✗ Python 3.11+ required, found {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"  ✓ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_env_file():
    """检查.env文件"""
    print_step(2, "Checking .env file...")

    if not Path('.env').exists():
        print("  ✗ .env file not found!")
        print("  Creating .env from .env.example...")

        if Path('.env.example').exists():
            import shutil
            shutil.copy('.env.example', '.env')
            print("  ✓ .env file created")
            print("  ⚠ Please edit .env and add your HUGGINGFACE_API_TOKEN")
            return False
        else:
            print("  ✗ .env.example not found!")
            return False

    # Check if token is set
    with open('.env', 'r') as f:
        content = f.read()
        if 'hf_your_token_here' in content or 'your_token_here' in content:
            print("  ⚠ HUGGINGFACE_API_TOKEN not configured in .env")
            print("  Please add your Hugging Face API token to .env")
            return False

    print("  ✓ .env file found and configured")
    return True


def check_database():
    """检查数据库连接"""
    print_step(3, "Checking database configuration...")

    from dotenv import load_dotenv
    load_dotenv()

    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("  ✗ DATABASE_URL not found in .env")
        return False

    print(f"  ✓ DATABASE_URL configured: {db_url[:30]}...")

    # Try to connect
    try:
        import asyncpg
        import asyncio

        async def test_connection():
            conn = await asyncpg.connect(db_url)
            await conn.close()
            return True

        result = asyncio.run(test_connection())
        if result:
            print("  ✓ Database connection successful")
        return result
    except Exception as e:
        print(f"  ✗ Database connection failed: {e}")
        print("  Make sure PostgreSQL is running")
        return False


def setup_virtual_environment():
    """设置虚拟环境"""
    print_step(4, "Setting up virtual environment...")

    if Path('venv').exists():
        print("  ✓ Virtual environment already exists")
        return True

    print("  Creating virtual environment...")
    try:
        subprocess.run([sys.executable, '-m', 'venv', 'venv'], check=True)
        print("  ✓ Virtual environment created")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Failed to create virtual environment: {e}")
        return False


def install_dependencies():
    """安装依赖"""
    print_step(5, "Installing dependencies...")

    if os.name == 'nt':  # Windows
        pip_path = Path('venv/Scripts/pip')
    else:  # Linux/Mac
        pip_path = Path('venv/bin/pip')

    if not pip_path.exists():
        print(f"  ✗ pip not found at {pip_path}")
        return False

    try:
        print("  Installing packages (this may take a few minutes)...")
        subprocess.run(
            [str(pip_path), 'install', '-q', '-r', 'requirements.txt'],
            check=True
        )
        print("  ✓ Dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Failed to install dependencies: {e}")
        return False


def create_directories():
    """创建必要的目录"""
    print_step(6, "Creating directories...")

    directories = ['uploads', 'logs', 'test_files']
    for dir_name in directories:
        Path(dir_name).mkdir(exist_ok=True)

    print("  ✓ Directories created")
    return True


def check_prisma():
    """检查Prisma是否已生成"""
    print_step(7, "Checking Prisma client...")

    # Check if we're in the right location
    project_root = Path(__file__).parent.parent.parent
    prisma_dir = project_root / 'packages' / 'db'

    if not prisma_dir.exists():
        print("  ⚠ Prisma directory not found")
        print("  Make sure you're running this from services/resume-parser/")
        return True  # Not a critical error

    # Check if schema.prisma exists
    schema_file = prisma_dir / 'prisma' / 'schema.prisma'
    if not schema_file.exists():
        print("  ✗ Prisma schema not found")
        return False

    print("  ✓ Prisma schema found")
    print("  ⚠ Make sure to run 'npx prisma generate' from packages/db/")
    return True


def test_api_connection():
    """测试API连接"""
    print_step(8, "Testing API connection...")

    try:
        import requests
        response = requests.get('http://localhost:8000/health', timeout=2)
        if response.status_code == 200:
            print("  ✓ API is running on http://localhost:8000")
            return True
    except:
        pass

    print("  ⚠ API is not running yet")
    print("  Start it with: python main.py or ./start.sh")
    return True  # Not a critical error


def main():
    """主函数"""
    print_header("Resume Parser API - Initialization")

    checks = [
        ("Python version", check_python_version),
        ("Environment file", check_env_file),
        ("Database", check_database),
        ("Virtual environment", setup_virtual_environment),
        ("Dependencies", install_dependencies),
        ("Directories", create_directories),
        ("Prisma", check_prisma),
        ("API connection", test_api_connection),
    ]

    results = {}
    for name, check_func in checks:
        try:
            results[name] = check_func()
        except Exception as e:
            print(f"  ✗ Error: {e}")
            results[name] = False

    # Print summary
    print_header("Initialization Summary")

    all_passed = True
    for name, passed in results.items():
        status = "✓" if passed else "✗"
        print(f"  {status} {name}")
        if not passed:
            all_passed = False

    print("\n" + "=" * 60)

    if all_passed:
        print("✓ All checks passed! Ready to start.")
        print("\nNext steps:")
        print("  1. Start the API: python main.py")
        print("  2. Open browser: http://localhost:8000/docs")
        print("  3. Test with: python test_api.py <resume_file>")
    else:
        print("✗ Some checks failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("  1. Add HUGGINGFACE_API_TOKEN to .env")
        print("  2. Start PostgreSQL database")
        print("  3. Run: npx prisma generate (from packages/db/)")

    print("=" * 60 + "\n")

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
