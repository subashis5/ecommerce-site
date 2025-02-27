import os
from datetime import timedelta

# Merchant Details
MERCHANT_NAME = "SUBASHIS PALAI"
MERCHANT_PAN = "IELPP2677M"
MERCHANT_PHONE = "+917735587118"

# Bank Account Details
BANK_ACCOUNT = {
    "account_number": "595102120001031",
    "account_name": "SUBASHIS PALAI",
    "ifsc_code": "UBIN0559512",
    "bank_name": "Union Bank of India"
}

# UPI Details
UPI_CONFIG = {
    "primary_id": "7735587118@fam",
    "phone_number": "7735587118",
    "supported_apps": ["PhonePe", "GooglePay", "BHIM"]
}

# Payment Limits
PAYMENT_LIMITS = {
    "min_amount": 1.00,
    "max_amount": 1000000.00,  # 10 Lakh limit as requested
    "cod_max_amount": 20000.00,  # Keeping COD limit lower for security
    "daily_transaction_limit": 1000000.00
}

# Order Status
ORDER_STATUSES = {
    "PENDING": "pending",
    "CONFIRMED": "confirmed",
    "PROCESSING": "processing",
    "SHIPPED": "shipped",
    "DELIVERED": "delivered",
    "CANCELLED": "cancelled"
}

# SMS Templates
SMS_CONFIG = {
    "api_key": "YOUR_SMS_GATEWAY_API_KEY",
    "sender_id": "MYSHOP",
    "templates": {
        "order_placed": "Thank you for shopping with us! Your order #{order_id} for ₹{amount} has been placed successfully. Track your order at: {tracking_url}",
        "payment_success": "Payment of ₹{amount} received for order #{order_id}. We'll start processing your order right away!",
        "order_confirmed": "Good news! Order #{order_id} is confirmed and being processed. Est. delivery: {delivery_date}",
        "order_shipped": "Your order #{order_id} has been shipped via {courier}! Track at: {tracking_url}",
        "order_delivered": "Order #{order_id} has been delivered! Rate your experience: {feedback_url}",
        "payment_failed": "Payment failed for order #{order_id}. Don't worry, try again here: {retry_url}"
    }
}

# Razorpay Configuration
RAZORPAY_CONFIG = {
    "key_id": "YOUR_RAZORPAY_KEY_ID",
    "key_secret": "YOUR_RAZORPAY_KEY_SECRET",
    "webhook_secret": "YOUR_WEBHOOK_SECRET",
    "automatic_capture": True,
    "payment_capture_time": 12,  # hours
    "retry_count": 3
}

# Security Configuration
SECURITY_CONFIG = {
    "otp_required_above": 50000.00,  # Amount above which OTP is required
    "max_daily_limit": 1000000.00,   # Maximum daily transaction limit
    "max_single_transaction": 500000.00,  # Maximum single transaction limit
    "suspicious_activity_threshold": 100000.00,  # Amount above which to flag for review
    "allowed_payment_methods": ["upi", "card", "netbanking", "wallet", "cod"],
    "blocked_countries": []  # Add countries to block if needed
}

# Automatic Order Updates
AUTO_UPDATE_CONFIG = {
    "enable_auto_confirmation": True,
    "confirmation_delay": 300,  # 5 minutes
    "enable_shipping_updates": True,
    "enable_delivery_updates": True,
    "notification_channels": ["sms", "email"],
    "update_intervals": {
        "processing": 3600,    # 1 hour
        "shipping": 7200,      # 2 hours
        "delivery": 14400      # 4 hours
    }
}

# JWT Configuration
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-here')
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

# Webhook Configuration
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', 'your-webhook-secret-here')
