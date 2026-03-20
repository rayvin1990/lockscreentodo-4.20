@echo off
REM 简化版启动脚本 - 显示详细进度

echo ====================================
echo Resume Parser FastAPI Service
echo ====================================
echo.

cd services\resume-parser

echo [1/4] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found
    pause
    exit /b 1
)

echo.
echo [2/4] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)

echo.
echo [3/4] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [4/4] Installing dependencies...
echo This may take a few minutes on first run...
pip install -r requirements.txt

echo.
echo ====================================
echo Starting API Server...
echo ====================================
echo API will be at: http://localhost:8000
echo Press Ctrl+C to stop
echo.

python main.py
