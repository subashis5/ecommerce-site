from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    specifications = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'stock': self.stock,
            'image_url': self.image_url,
            'category': self.category,
            'specifications': json.loads(self.specifications) if self.specifications else {}
        }

# Create tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        category = request.args.get('category')
        query = Product.query
        
        if category and category.lower() != 'all':
            query = query.filter(Product.category == category)
        
        products = query.all()
        return jsonify([product.to_dict() for product in products])
    
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        return jsonify({'error': 'Failed to fetch products'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict())
    
    except Exception as e:
        print(f"Error fetching product {product_id}: {str(e)}")
        return jsonify({'error': f'Failed to fetch product {product_id}'}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        return jsonify(['All'] + [category[0] for category in categories])
    
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")
        return jsonify({'error': 'Failed to fetch categories'}), 500

if __name__ == '__main__':
    app.run(debug=True)
