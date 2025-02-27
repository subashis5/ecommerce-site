from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    specifications = db.Column(db.Text, nullable=True)

# Sample products with optimized image URLs
products_data = [
    {
        "name": "iPhone 15 Pro Max",
        "description": "Latest iPhone with A17 Pro chip, Titanium design, and 48MP camera system",
        "price": 159900,
        "category": "Smartphones",
        "stock": 50,
        "image_url": "https://m.media-amazon.com/images/I/81dT7CUY6GL._SL1500_.jpg",
        "specifications": json.dumps({
            "display": "6.7-inch Super Retina XDR OLED",
            "processor": "A17 Pro chip",
            "camera": "48MP main + 12MP ultra + 12MP telephoto",
            "battery": "4422 mAh"
        })
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "Premium Android flagship with S Pen and AI features",
        "price": 129999,
        "category": "Smartphones",
        "stock": 45,
        "image_url": "https://m.media-amazon.com/images/I/71YdE55GwjL._SL1500_.jpg",
        "specifications": json.dumps({
            "display": "6.8-inch Dynamic AMOLED 2X",
            "processor": "Snapdragon 8 Gen 3",
            "camera": "200MP main + 12MP ultra + 50MP telephoto",
            "battery": "5000 mAh"
        })
    },
    {
        "name": "MacBook Pro 16 M3 Max",
        "description": "Most powerful MacBook with M3 Max chip and mini-LED display",
        "price": 349900,
        "category": "Laptops",
        "stock": 30,
        "image_url": "https://m.media-amazon.com/images/I/61LNGJEMh0L._SL1500_.jpg",
        "specifications": json.dumps({
            "display": "16.2-inch Liquid Retina XDR",
            "processor": "M3 Max chip",
            "memory": "32GB unified memory",
            "storage": "1TB SSD"
        })
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Premium noise-cancelling headphones with exceptional sound",
        "price": 29990,
        "category": "Audio",
        "stock": 60,
        "image_url": "https://m.media-amazon.com/images/I/61vJtKbAssL._SL1500_.jpg",
        "specifications": json.dumps({
            "type": "Over-ear wireless",
            "battery": "Up to 30 hours",
            "noise_cancelling": "Advanced ANC",
            "connectivity": "Bluetooth 5.2"
        })
    },
    {
        "name": "iPad Pro 12.9 M2",
        "description": "Professional tablet with M2 chip and mini-LED display",
        "price": 119900,
        "category": "Tablets",
        "stock": 40,
        "image_url": "https://m.media-amazon.com/images/I/81c+9BOQNWL._SL1500_.jpg",
        "specifications": json.dumps({
            "display": "12.9-inch mini-LED",
            "processor": "M2 chip",
            "storage": "256GB",
            "features": "Face ID, Apple Pencil 2 support"
        })
    },
    {
        "name": "Sony A7 IV",
        "description": "Full-frame mirrorless camera with advanced autofocus",
        "price": 214990,
        "category": "Cameras",
        "stock": 25,
        "image_url": "https://m.media-amazon.com/images/I/81HwzslV3VL._SL1500_.jpg",
        "specifications": json.dumps({
            "sensor": "33MP full-frame",
            "video": "4K 60fps 10-bit",
            "autofocus": "759 phase-detect points",
            "stabilization": "5-axis IBIS"
        })
    },
    {
        "name": "Apple Watch Ultra 2",
        "description": "Premium smartwatch with titanium case and advanced health features",
        "price": 89900,
        "category": "Wearables",
        "stock": 35,
        "image_url": "https://m.media-amazon.com/images/I/81Qp0rJ9GtL._SL1500_.jpg",
        "specifications": json.dumps({
            "display": "Always-On Retina",
            "case": "49mm titanium",
            "battery": "Up to 36 hours",
            "features": "ECG, Blood Oxygen"
        })
    },
    {
        "name": "DJI Air 3",
        "description": "Advanced drone with dual cameras and obstacle avoidance",
        "price": 119900,
        "category": "Drones",
        "stock": 20,
        "image_url": "https://m.media-amazon.com/images/I/61K6TxhfUXL._SL1500_.jpg",
        "specifications": json.dumps({
            "camera": "Dual 1/1.3-inch CMOS",
            "video": "4K 60fps HDR",
            "flight_time": "46 minutes",
            "range": "20km transmission"
        })
    },
    {
        "name": "PlayStation 5",
        "description": "Next-gen gaming console with DualSense controller",
        "price": 54990,
        "category": "Gaming",
        "stock": 30,
        "image_url": "https://m.media-amazon.com/images/I/61hJ40qZKKL._SL1500_.jpg",
        "specifications": json.dumps({
            "cpu": "AMD Zen 2",
            "gpu": "10.28 TFLOPS RDNA 2",
            "storage": "825GB SSD",
            "resolution": "4K 120Hz"
        })
    },
    {
        "name": "Bose QuietComfort Ultra",
        "description": "Premium noise-cancelling earbuds with spatial audio",
        "price": 24990,
        "category": "Audio",
        "stock": 50,
        "image_url": "https://m.media-amazon.com/images/I/61j3KhV7rJL._SL1500_.jpg",
        "specifications": json.dumps({
            "type": "True wireless earbuds",
            "battery": "6 hours + 24 hours case",
            "features": "CustomTune, Spatial Audio",
            "connectivity": "Bluetooth 5.3"
        })
    }
]

def add_sample_products():
    with app.app_context():
        # Drop existing tables and create new ones
        db.drop_all()
        db.create_all()
        
        # Add sample products
        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print("Sample products added successfully!")

if __name__ == '__main__':
    add_sample_products()
