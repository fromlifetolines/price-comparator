# Price Comparator Platform

### 🔴 [Click here to open Live Demo (線上試用)](https://price-comparator-ll3q.onrender.com)

A powerful price comparison website for Yahoo, PChome, MOMO, Shopee, and Coupang.

## 🚀 Quick Start (Local)

1. **Start Backend** (Terminal 1)

    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
    ```

2. **Start Frontend** (Terminal 2)

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3. **Open Website**:
    - **Local**: [http://localhost:3000](http://localhost:3000)
    - **Cloud (Live)**: [https://price-comparator-ll3q.onrender.com](https://price-comparator-ll3q.onrender.com)

## ☁️ Run on GitHub (Codespaces)

1. Click the green **Code** button above.
2. Select **Codespaces** tab.
3. Click **Create codespace on main**.
4. Wait for it to load, then click "Open in Browser" when prompted.

## Project Structure

- `frontend/`: The User Interface (Next.js). **This is what you see.**
- `backend/`: The Logic (FastAPI). Runs silently in the background.
- `scraper/`: The Robots (Puppeteer). Fetches prices.
