from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    favorites = relationship("Favorite", back_populates="user")
    alerts = relationship("PriceAlert", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    links = relationship("ProductLink", back_populates="product", lazy="joined")
    favorites = relationship("Favorite", back_populates="product")
    alerts = relationship("PriceAlert", back_populates="product")

class ProductLink(Base):
    __tablename__ = "product_links"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    platform_name = Column(String) # Yahoo, PChome, MOMO, etc.
    url = Column(String, unique=True)
    current_price = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="links")
    prices = relationship("PriceHistory", back_populates="link")

class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(Integer, primary_key=True, index=True)
    link_id = Column(Integer, ForeignKey("product_links.id"))
    price = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    link = relationship("ProductLink", back_populates="prices")

class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    
    user = relationship("User", back_populates="favorites")
    product = relationship("Product", back_populates="favorites")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    target_price = Column(Float)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="alerts")
    product = relationship("Product", back_populates="alerts")
