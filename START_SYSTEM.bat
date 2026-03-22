@echo off
setlocal

echo.
echo ======================================================
echo 🛡️  FELUDA AI: CYBER INTELLIGENCE SYSTEM STARTUP
echo ======================================================
echo.

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python to continue.
    pause
    exit /b
)

:: 2. Setup Virtual Environment
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

:: 3. Install Dependencies
echo [INFO] Installing backend dependencies...
call venv\Scripts\activate
pip install -r requirements.txt

:: 4. Train Models if missing
if not exist "app/models/phishing_model.pkl" (
    echo [INFO] Training ML models...
    python train_model.py
)

:: 5. Start Backend in new window
echo [INFO] Starting FastAPI Backend on http://localhost:8001...
start "Feluda Backend" cmd /c "venv\Scripts\activate && uvicorn app.main:app --reload --port 8001"

:: 6. Start Frontend
echo [INFO] Starting Dashboard React on http://localhost:5173...
cd dashboard-react
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)
start "Feluda Dashboard" cmd /c "npm run dev"

echo.
echo ======================================================
echo ✅ SYSTEM LAUNCHED SUCCESSFULLY
echo ======================================================
echo.
echo Backend:   http://localhost:8001
echo Dashboard: http://localhost:5173/dashboard/
echo.
pause
