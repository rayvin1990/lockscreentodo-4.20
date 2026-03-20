@echo off
REM 启动简历解析FastAPI服务

echo ====================================
echo Resume Parser FastAPI Service
echo ====================================
echo.

cd services\resume-parser

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python not found. Please install Python 3.11+
    pause
    exit /b 1
)

REM 检查虚拟环境
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM 激活虚拟环境
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM 安装依赖
echo Installing dependencies...
pip install -q -r requirements.txt

REM 创建必要的目录
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs

echo.
echo Starting Resume Parser API...
echo API will be available at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM 启动服务
python main.py
