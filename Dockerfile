# Base image with Python
FROM python:3.10-slim

# Install Node.js 18 and Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    wget \
    unzip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Build Frontend
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

# 2. Setup Scraper
COPY scraper/package.json scraper/package-lock.json ./scraper/
RUN cd scraper && npm install
COPY scraper ./scraper/
# Create Puppeteer cache directory to avoid permission issues
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
# Install Chrome manually or trust Puppeteer's automated install if we didn't skip. 
# Better: Let Puppeteer install chrome locally but ensure dependencies are met.
# Resetting skip for simple setup, relying on 'npx puppeteer browsers install chrome' if needed.
# For simplicity in this env, we rely on apt-get installing dependencies and Puppeteer installing Chromium.

# 3. Setup Backend
COPY backend/requirements.txt ./backend/
RUN cd backend && pip install -r requirements.txt
COPY backend ./backend/

# Expose port
EXPOSE 8000

# Run
WORKDIR /app/backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
