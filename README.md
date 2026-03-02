# 🛡️ Feluda AI — Cyber Intelligence System

**Feluda AI** is a premium, full-stack phishing detection and cyber threat intelligence platform. It combines a **FastAPI Backend**, a **Glassmorphism Dashboard**, and a **Real-Time Chrome Extension** to identify and block malicious links using a Hybrid Neural Architecture.

---

## 🚀 Key Features

- **Neural Link Shield (Chrome Extension)**: Real-time "Neural Heartbeat" pulse scanning on all on-page links with risk badges.
- **7-Step Intelligence Pipeline**: Feature Extraction → Calibrated ML → SHAP Explainability → Threat Intel → Visual Brand Similarity → Behavioral DOM → Hybrid Scoring.
- **Hybrid AI Scoring**: Scikit-Learn (Calibrated Random Forest + Platt Scaling), SHAP feature attribution, Google Safe Browsing & VirusTotal APIs.
- **Behavioral Engine**: Detects credential harvesting forms, hidden iframes, and obfuscated JavaScript by fetching live page HTML.
- **Email Scanner**: Keyword NLP + OpenAI GPT-4o-mini semantic phishing analysis.
- **QR Code Scanner**: Upload an image and scan embedded URLs for threats.
- **Admin Blacklist**: Manually blacklist domains from the dashboard.

---

## 🌍 Deployment (GitHub → Vercel)

This project is pre-configured for **GitHub → Vercel** deployment.

### 1. Backend (FastAPI on Vercel)
- **Requirements**: All dependencies in `requirements.txt`.
- **Database**: Connects to **MongoDB Atlas**. Set `MONGO_URI` in your Vercel Environment Variables.

### 2. Environment Variables (Vercel Dashboard)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `OPENAI_API_KEY` | For GPT-4o-mini email analysis |
| `VIRUSTOTAL_API_KEY` | VirusTotal threat intelligence |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Google Safe Browsing API |
| `API_PORT` | Port (default: `8001`) |

### 3. Chrome Extension Setup
1. Open `extension/config.js`
2. Replace `http://localhost:8001` with your **Vercel Deployment URL** (e.g., `https://your-feluda.vercel.app`)
3. Go to `chrome://extensions` → Enable **Developer Mode** → **Load Unpacked** → select the `extension/` folder

### 4. Dashboard — Google Login
Open `dashboard/index.html` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID from [Google Cloud Console](https://console.cloud.google.com/).

---

## 🛠️ Local Development

### Quick Start (Windows)
```bat
START_SYSTEM.bat
```
This will automatically:
- Create a Python virtual environment
- Install all dependencies from `requirements.txt`
- Train the base ML models if they are missing
- Launch the FastAPI server on `http://127.0.0.1:8001`
- Open the dashboard in your browser

### Manual Start
```bash
# 1. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train ML models (first-time only)
python train_model.py

# 4. Copy .env.example and fill in your API keys
copy .env.example .env

# 5. Start the server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan/url` | Full 7-step URL phishing analysis |
| `POST` | `/api/scan/email` | Email content phishing analysis |
| `POST` | `/api/scan/qr` | QR code image upload & scan |
| `GET`  | `/api/analytics/stats` | Dashboard statistics |
| `GET`  | `/api/analytics/logs` | Recent scan history |
| `POST` | `/api/admin/blacklist` | Blacklist a domain |
| `GET`  | `/api/health` | Health check |

---

## 🎨 Design Philosophy
Feluda AI follows a **"Cinematic Obsidian"** aesthetic — pure black backgrounds, glassmorphism, and neon-green accents, designed to feel like a premium, award-winning security product.

---

*Built for Maximum Impact Hackathons & Security Demos.*
