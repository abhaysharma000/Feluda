@echo off
setlocal
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
    echo  [ERROR] Python not found. Please install Python 3.10+ and add it to PATH.
    pause
    exit /b 1
)
echo  [OK] Python found.

:: ── Step 2: Virtual environment ─────────────────────────────────
if not exist "venv\" (
    echo  [*] Creating Python Virtual Environment...
    python -m venv venv
    if errorlevel 1 (
        echo  [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo  [OK] Virtual environment created.
)

:: ── Step 3: Install / update core dependencies ──────────────────
echo  [*] Installing core dependencies from requirements.txt...
venv\Scripts\pip.exe install --upgrade pip --quiet
venv\Scripts\pip.exe install -r requirements.txt --quiet
if errorlevel 1 (
    echo  [ERROR] Dependency installation failed. Check requirements.txt.
    pause
    exit /b 1
)
echo  [OK] Core dependencies installed.

:: ── Step 4: Install local-only extras (not on Vercel) ─────────
echo  [*] Installing local-only extras (SHAP explainability)...
venv\Scripts\pip.exe install shap --quiet
if errorlevel 1 (
    echo  [WARN] SHAP install failed - explainability will be disabled. Continuing...
) else (
    echo  [OK] SHAP installed - feature attribution enabled.
)

:: ── Step 5: ML Model training ────────────────────────────────────
echo  [*] Checking ML Models...
if not exist "app\models\phishing_model.pkl" (
    echo  [!] Primary model not found. Training now (this takes ~60 seconds)...
    venv\Scripts\python.exe train_model.py
    if errorlevel 1 (
        echo  [WARN] Primary model training failed. API will run without ML scoring.
    ) else (
        echo  [OK] Primary Calibrated Random Forest model trained.
    )
) else (
    echo  [OK] ML models found.
)

if not exist "app\models\url_rf_model.pkl" (
    if exist "app\ml_legacy\train.py" (
        echo  [!] Training legacy URL/Text models...
        venv\Scripts\python.exe app\ml_legacy\train.py
    )
)

:: ── Step 6: .env check ───────────────────────────────────────────
if not exist ".env" (
    echo.
    echo  [WARN] No .env file found!
    echo         Copy .env.example to .env and fill in your API keys.
    echo         Without keys: VirusTotal and GPT analysis will be skipped.
    echo.
)

:: ── Ready banner ─────────────────────────────────────────────────
echo.
echo  =========================================================
echo   [READY]  Feluda AI Backend is starting...
echo  ---------------------------------------------------------
echo   Dashboard  :  http://127.0.0.1:8001/dashboard/index.html
echo   API Docs   :  http://127.0.0.1:8001/docs
echo   Health     :  http://127.0.0.1:8001/api/health
echo  ---------------------------------------------------------
echo   Press Ctrl+C to stop the server.
echo  =========================================================
echo.

:: Open dashboard after 5 seconds
start /min cmd /c "timeout /t 5 >nul && start http://127.0.0.1:8001/dashboard/index.html"

:: Launch FastAPI with auto-reload
venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

pause
