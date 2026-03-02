@echo off
setlocal
title Feluda AI - Unified Intelligence System
color 0B

echo =======================================================
echo       Feluda AI - Cyber Intelligence Platform
echo       Version 2.0 - Maximum Detection Engine
echo =======================================================
echo.

echo [*] Checking Backend Setup...
if not exist "venv\" (
    echo [!] Creating Python Virtual Environment...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Is Python installed?
        pause
        exit /b 1
    )
)

if not exist "venv\Scripts\uvicorn.exe" (
    echo [!] Installing Dependencies (this may take a few minutes)...
    venv\Scripts\pip.exe install --upgrade pip
    venv\Scripts\pip.exe install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Dependency installation failed. Check requirements.txt.
        pause
        exit /b 1
    )
)

echo [*] Checking ML Models...
if not exist "app\models\url_rf_model.pkl" (
    if exist "app\ml_legacy\train.py" (
        echo [!] Training Legacy URL/Text ML Models...
        venv\Scripts\python.exe app\ml_legacy\train.py
    )
)
if not exist "app\models\phishing_model.pkl" (
    echo [!] Training Primary Calibrated Random Forest Model...
    venv\Scripts\python.exe train_model.py
)

echo.
echo [*] System Initialized Successfully!
echo -------------------------------------------------------
echo   Dashboard  : http://127.0.0.1:8001/dashboard/index.html
echo   API Docs   : http://127.0.0.1:8001/docs
echo   Health     : http://127.0.0.1:8001/api/health
echo -------------------------------------------------------
echo.
echo [*] Starting Feluda AI Server...
echo Press Ctrl+C to stop.
echo.

:: Open dashboard in browser after 5 seconds
start /min cmd /c "timeout /t 5 >nul && start http://127.0.0.1:8001/dashboard/index.html"

:: Launch FastAPI server
venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

pause
