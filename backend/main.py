from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import database
import os
import subprocess
import json
import sys

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Price Comparator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Imports moved to top

# ... (Middleware kept above)

# API routes must be defined BEFORE static mount to take precedence
@app.get("/api-status")
def read_status():
    return {"status": "ok"}

@app.get("/debug/logs")
def read_debug_logs():
    log_path = "backend_debug.log"
    if os.path.exists(log_path):
        with open(log_path, "r") as f:
            # Return last 2000 chars
            content = f.read()
            return {"logs": content[-2000:]}
    return {"logs": "Log file not found"}

# ... (Search logic remains below, but we need to move the mount to the end or ensure API routes are explicitly defined)

# We will add the static mount AFTER all API routes are defined, 
# but for now I will add it here and move the catch-all to the very end of file.

# (Actually, in FastAPI, order matters. Specific routes first.)


import subprocess
import json
import sys

# Basic search placeholder
@app.get("/search")
def search_products(q: str, db: Session = Depends(database.get_db)):
    # 1. Check if we have recent results in DB (Skipping for now, always live scrape for demo)
    
    # 2. Trigger Scraper
    # Note: This blocks the request. In production, use background tasks (Celery/RQ).
    try:
        # Run the scraper as a subprocess
        # Using npm start directly ensures all ts-node and environment setups are correct
        # Note: We need to use 'npm run start -- <keyword>' or direct 'ts-node' if configured
        print(f"Running scraper for: {q}")
        
        # Absolute path to scraper directory
        scraper_dir = os.path.abspath("../scraper")
        
        # Command to run scraper. 
        # Using 'npm start -- "keyword"' passes the keyword to the script
        cmd = ["npm", "start", "--", q]
        
        result = subprocess.run(
            cmd,
            cwd=scraper_dir,
            capture_output=True,
            text=True,
            encoding="utf-8" # Explicit encoding
        )
        
        print("Scraper return code:", result.returncode)
        if result.returncode != 0:
            print("Scraper Error Output:", result.stderr)
            # Fallback to local DB search if scraper fails
            return db.query(models.Product).filter(models.Product.name.contains(q)).all()
            
        # Parse JSON output from stdout
        # stdout might contain mixed logs if console.log was used for debug. 
        # We try to find the line that looks like a JSON array.
        output_lines = result.stdout.strip().split('\n')
        json_output = "[]"
        
        # Iterate from end to start to find the last JSON array
        for line in reversed(output_lines):
            line = line.strip()
            if line.startswith("[") and line.endswith("]"):
                try:
                    json.loads(line) # Verify it is valid JSON
                    json_output = line
                    break
                except:
                    continue
        
        # LOGGING TO FILE
        with open("backend_debug.log", "a") as logf:
            logf.write(f"\n--- Search: {q} ---\n")
            logf.write(f"Return Code: {result.returncode}\n")
            logf.write("STDERR:\n")
            logf.write(result.stderr)
            logf.write("\nSTDOUT:\n")
            logf.write(result.stdout)
            logf.write("\n-------------------\n")

        print(f"Parsing JSON line length: {len(json_output)}")
        try:
             scraped_data = json.loads(json_output)
        except:
             print("Failed to parse scraper JSON output. RAW STDOUT:")
             print(result.stdout)
             scraped_data = []

        if not scraped_data:
             print("Scraped data is empty. RAW STDOUT was:")
             print(result.stdout)
             # Fallback to Mock Data to prove system is working
             scraped_data = [
                 {
                     "title": f"系統訊息：雲端爬蟲被阻擋，顯示測試資料 - 搜尋關鍵字：{q}",
                     "price": 0,
                     "link": "https://github.com/fromlifetolines/price-comparator",
                     "image": "",
                     "platform": "System"
                 },
                 {
                     "title": "[測試商品] iPad Pro 12.9吋 (示範資料)",
                     "price": 35000,
                     "link": "#",
                     "image": "",
                     "platform": "Demo"
                 }
             ]


        print(f"Scraped {len(scraped_data)} items total")
        
        # 3. Save/Update DB (Simplified sync)
        if not scraped_data:
             print("No data to save.")
        
        products_to_return = []
        # Clear existing? No, we append/update.
        
        for item in scraped_data:
            # Simple logic: check if product exists by name, else create
            
            # Check exist by name
            p = db.query(models.Product).filter(models.Product.name == item['title']).first()
            if not p:
                p = models.Product(
                    name=item['title'],
                    image_url="", # Scraper didn't capture image yet in all cases
                    description=""
                )
                db.add(p)
                db.commit()
                db.refresh(p)
            
            # Add Link/Price
            # Check link
            link = db.query(models.ProductLink).filter(models.ProductLink.url == item.get('link', '')).first()
            if not link and item.get('link'):
                price_val = 0.0
                try:
                    # Clean price string "$1,299" -> 1299
                    price_str = str(item['price']).replace('$', '').replace(',', '')
                    price_val = float(price_str)
                except:
                    pass
                
                link = models.ProductLink(
                    product_id=p.id,
                    platform_name=item.get('platform', 'Unknown'),
                    url=item.get('link'),
                    current_price=price_val
                )
                db.add(link)
                db.commit()
            
            products_to_return.append(p)
        
        # Re-query properly to get relations
        return db.query(models.Product).filter(models.Product.name.contains(q)).all()

    except Exception as e:
        print(f"Error running scraper: {e}")
        return []

# --- Static File Serving (Must be last) ---
# Check if frontend build exists
frontend_dist = os.path.abspath("../frontend/out")
if os.path.exists(frontend_dist):
    app.mount("/_next/static", StaticFiles(directory=os.path.join(frontend_dist, "_next/static")), name="static")
    # app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend") # html=True serves index.html for root but not for subpaths correctly in all SPA cases
    
    # Custom SPA catch-all
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # Check if file exists in dist
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
             return FileResponse(file_path)
        
        # Otherwise serve index.html
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    print("Frontend build not found at ../frontend/out. Running API only.")
