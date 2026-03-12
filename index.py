from app.main import app

# This root-level entry point solves path ambiguity on Vercel
# and ensures 'app' is treated as a proper package.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
