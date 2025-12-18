from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Price Comparator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Price Comparator API"}

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
        # Assuming scraper is at sibling directory ../scraper
        # Using npx ts-node to run directly
        result = subprocess.run(
            ["npm", "start", q], 
            cwd="../scraper", 
            capture_output=True, 
            text=True
        )
        
        if result.returncode != 0:
            print(f"Scraper Error: {result.stderr}")
            # Fallback to local DB search if scraper fails
            return db.query(models.Product).filter(models.Product.name.contains(q)).all()
            
        # Parse JSON output from stdout
        # stdout might contain other logs if not filtered perfectly, but we try to find the last line or parse all
        lines = result.stdout.strip().split('\n')
        json_output = lines[-1] if lines else "[]"
        
        scraped_data = json.loads(json_output)
        
        # 3. Save/Update DB
        products_to_return = []
        for item in scraped_data:
            # Simple logic: check if product exists by name, else create
            # In reality, matching is harder.
            
            # Create a "Shell" product for each result or merge?
            # For this demo, we just return the scraped structure mapped to our schema
            # Or just return raw JSON for the frontend to render, but that defeats the purpose of DB.
            # Let's simple-save.
            
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
