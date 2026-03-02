@echo off
setlocal EnableDelayedExpansion
title Feluda AI - Unified Intelligence System
color 0B

echo.
echo  =========================================================
echo        FELUDA AI   -   Cyber Intelligence Platform
echo        Version 2.0   -   Maximum Detection Engine
echo  =========================================================
echo.

:: ── Step 1: Python check ────────────────────────────────────────
where python >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Python not found. Install Python 3.10+ and add to PATH.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do set PYVER=%%v
echo  [OK] %PYVER% found.

:: ── Step 2: Recreate venv if broken or missing ──────────────────
set VENV_PYTHON=venv\Scripts\python.exe
set VENV_OK=0

if exist "%VENV_PYTHON%" (
    "%VENV_PYTHON%" --version >nul 2>&1
    if not errorlevel 1 set VENV_OK=1
)

if "%VENV_OK%"=="0" (
    echo  [*] Creating fresh virtual environment...
    if exist "venv\" rmdir /s /q venv
    python -m venv venv
    if errorlevel 1 (
        echo  [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo  [OK] Virtual environment created.
) else (
    echo  [OK] Virtual environment ready.
)

:: ── Step 3: Install core dependencies via python -m pip ─────────
echo  [*] Installing/updating core dependencies...
"%VENV_PYTHON%" -m pip install --upgrade pip --quiet --no-warn-script-location
"%VENV_PYTHON%" -m pip install -r requirements.txt --quiet --no-warn-script-location
if errorlevel 1 (
    echo  [ERROR] Dependency installation failed.
    echo         Try deleting the venv\ folder and running this file again.
    pause
    exit /b 1
)
echo  [OK] Core dependencies installed.

:: ── Step 4: Local-only extra: SHAP (not on Vercel) ──────────────
echo  [*] Installing SHAP for local explainability...
"%VENV_PYTHON%" -m pip install shap --quiet --no-warn-script-location
if errorlevel 1 (
    echo  [WARN] SHAP not installed - feature attribution disabled locally.
) else (
    echo  [OK] SHAP installed.
)

:: ── Step 5: ML Model check ───────────────────────────────────────
echo  [*] Checking ML models...
if not exist "app\models\phishing_model.pkl" (
    echo  [!] Primary model missing. Training now (~60s)...
    "%VENV_PYTHON%" train_model.py
    if errorlevel 1 (
        echo  [WARN] Model training failed. API will run without ML scoring.
    ) else (
        echo  [OK] Model trained successfully.
    )
) else (
    echo  [OK] ML models found.
)

if not exist "app\models\url_rf_model.pkl" (
    if exist "app\ml_legacy\train.py" (
        echo  [!] Training legacy models...
        "%VENV_PYTHON%" app\ml_legacy\train.py
    )
)

:: ── Step 6: .env check ───────────────────────────────────────────
if not exist ".env" (
    echo.
    echo  [WARN] .env file not found!
    echo         Copying .env.example to .env - fill in your API keys.
    copy .env.example .env >nul 2>&1
    echo         Edit .env before production use.
    echo.
)

:: ── Step 7: Launch ───────────────────────────────────────────────
echo.
echo  =========================================================
echo   [READY]  Starting Feluda AI...
echo  ---------------------------------------------------------
echo   Dashboard  :  http://127.0.0.1:8001/dashboard/index.html
echo   API Docs   :  http://127.0.0.1:8001/docs
echo   Health     :  http://127.0.0.1:8001/api/health
echo  ---------------------------------------------------------
echo   Press Ctrl+C to stop.
echo  =========================================================
echo.

:: Open browser after 5 seconds
start /min cmd /c "timeout /t 5 >nul && start http://127.0.0.1:8001/dashboard/index.html"

:: Launch server using venv python directly (avoids pip.exe path bug)
"%VENV_PYTHON%" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

pause
