# 🚀 Deploying Feluda Backend to Vercel

Follow these steps to put your Cyber Intelligence Engine online:

### 1. Install Vercel CLI
If you haven't already, run this in your terminal:
```bash
npm install -g vercel
```

### 2. Login & Deploy
Run these commands from the `Feluda` folder:
```bash
vercel login
vercel
```
- When it asks "Set up and deploy?", type `Y`.
- When it asks for the project name, use `feluda-ai-backend`.
- For other options, just hit **Enter** (defaults are fine).

### 3. Get your URL
Once the deployment finishes, Vercel will give you a "Production" URL (e.g., `https://feluda-ai-backend.vercel.app`).

### 4. Update Extension
Open `extension/config.js` and update `API_BASE_URL` with your new Vercel URL.

---
**Note**: The model (`phishing_model.pkl`) is already included in your folder, so Vercel will upload it automatically.
