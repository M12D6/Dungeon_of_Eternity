@echo off
echo Starting Dungeon of Eternity Server...
echo.
echo Server will run on: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python to run the server
    pause
    exit /b 1
)

REM Start the server
python -m http.server 8000

pause
