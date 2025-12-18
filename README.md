# Price Comparator Platform

## Components

### 1. Frontend (Next.js)

Located in `frontend/`.

- **Run**: `cd frontend && npm run dev`
- **Port**: 3000

### 2. Backend (FastAPI)

Located in `backend/`.

- **Setup**: `cd backend && pip install -r requirements.txt`
- **Run**: `cd backend && uvicorn main:app --reload`
- **Port**: 8000
- **Docs**: <http://localhost:8000/docs>

### 3. Scraper (Node.js)

Located in `scraper/`.

- **Setup**: `cd scraper && npm install`
- **Run**: `cd scraper && npm start`
- **Run specific**: `cd scraper && npm start "keyword"`

## Prerequisites

- Node.js
- Python 3.8+
- PostgreSQL (Ensure it's running and connection string is set in backend)
