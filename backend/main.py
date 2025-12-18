from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Price Comparator API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Price Comparator API"}

# Basic search placeholder
@app.get("/search")
def search_products(q: str, db: Session = Depends(database.get_db)):
    # This would eventually use full-text search or similar
    products = db.query(models.Product).filter(models.Product.name.contains(q)).all()
    return products

@app.post("/products/test-create")
def create_test_product(name: str, db: Session = Depends(database.get_db)):
    # Helper to seed data
    product = models.Product(name=name)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
