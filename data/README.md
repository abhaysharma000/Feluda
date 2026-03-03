# Feluda ML Training Data

Place your professional phishing datasets in this directory for the `scripts/train_advanced.py` script to find them.

## Required Files
1. **Kaggle**: `kaggle_phishing.csv`
2. **PhishTank**: `phishtank_verified.csv` (Verified Online CSV)
3. **OpenPhish**: `openphish_feed.txt` (URL Feed)

## Why these datasets?
- **Kaggle**: Provides a balanced mix of safe (benign) and phishing URLs for general classification.
- **PhishTank**: Focuses on verified, high-confidence phishing reports to learn aggressive threat signatures.
- **OpenPhish**: Provides technical intelligence on zero-day phishing origins.

## How to run
After placing the files, run:
```bash
python scripts/train_advanced.py
```
This will generate an upgraded `app/models/phishing_model.pkl` with professional-grade accuracy.
