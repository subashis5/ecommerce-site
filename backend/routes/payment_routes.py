from flask import Blueprint, request, jsonify
import razorpay
from datetime import datetime
import json
import hmac
import hashlib
import requests
from config import (
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,
    SMS_API_KEY,
    DEFAULT_UPI_ID
)

payment_routes = Blueprint('payment_routes', __name__)

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

def send_payment_sms(phone_number, amount, order_id, status):
    """Send payment confirmation SMS"""
    url = "https://api.textlocal.in/send/"
    message = f"Payment {status} for order {order_id}. Amount: ₹{amount}. Thank you for shopping with us!"
    
    params = {
        'apikey': SMS_API_KEY,
        'numbers': phone_number,
        'message': message,
        'sender': 'MYSHOP'
    }
    
    try:
        response = requests.post(url, data=params)
        return response.json()
    except Exception as e:
        print(f"SMS sending failed: {str(e)}")
        return None

@payment_routes.route('/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = int(float(data['amount']) * 100)  # Convert to paise
        currency = "INR"
        
        # Create Razorpay Order
        payment_data = {
            'amount': amount,
            'currency': currency,
            'payment_capture': 1,
            'notes': {
                'upi_id': DEFAULT_UPI_ID,  # Your UPI ID
                'merchant_phone': '+917735587118'  # Your phone number
            }
        }
        
        order = razorpay_client.order.create(data=payment_data)
        
        return jsonify({
            'id': order['id'],
            'amount': amount,
            'currency': currency,
            'key': RAZORPAY_KEY_ID
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@payment_routes.route('/verify-payment', methods=['POST'])
def verify_payment():
    try:
        data = request.json
        
        # Verify payment signature
        params_dict = {
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_signature': data['razorpay_signature']
        }
        
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Get payment details
        payment = razorpay_client.payment.fetch(data['razorpay_payment_id'])
        
        # Send confirmation SMS
        if 'contact' in payment:
            send_payment_sms(
                payment['contact'],
                float(payment['amount']) / 100,
                payment['order_id'],
                'successful'
            )
        
        return jsonify({
            'status': 'success',
            'payment_id': data['razorpay_payment_id'],
            'order_id': data['razorpay_order_id']
        })
    except Exception as e:
        # Send failure SMS if phone number is available
        if 'contact' in payment:
            send_payment_sms(
                payment['contact'],
                float(payment['amount']) / 100,
                payment['order_id'],
                'failed'
            )
        return jsonify({'error': str(e)}), 400

@payment_routes.route('/payment-methods', methods=['GET'])
def get_payment_methods():
    """Get available payment methods"""
    return jsonify({
        'upi': {
            'id': DEFAULT_UPI_ID,
            'phone': '+917735587118'
        },
        'bank_account': {
            'account_number': '595102120001031',
            'holder_name': 'Merchant Name',  # Replace with your name
            'ifsc': 'BANK_IFSC'  # Replace with your bank's IFSC
        },
        'methods': [
            'upi',
            'card',
            'netbanking',
            'wallet',
            'cod'
        ]
    })
