#!/bin/bash

# Kill ports to ensure clean start
# Ensure we are in the script's directory
cd "$(dirname "$0")"

echo "Cleaning up ports 3000 and 8000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "Starting Backend (Port 8000)..."
cd backend
# Check for venv (optional) but run with python3
# Installing deps just in case
pip install -r requirements.txt > /dev/null 2>&1
nohup python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload > ../backend_debug.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID). Logs in backend_debug.log"

cd ../frontend
echo "Installing Frontend Dependencies..."
npm install > /dev/null 2>&1

echo "Starting Frontend (Port 3000)..."
echo "Project will be available at http://localhost:3000"
npm run dev
