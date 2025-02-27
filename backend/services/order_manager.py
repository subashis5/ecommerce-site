from datetime import datetime, timedelta
import threading
import time
from config import ORDER_STATUSES, AUTO_UPDATE_CONFIG, SMS_CONFIG
import requests
import json

class OrderManager:
    def __init__(self, db, sms_service):
        self.db = db
        self.sms_service = sms_service
        self.update_thread = None
        self.running = False

    def start_monitoring(self):
        """Start the order monitoring thread"""
        if not self.running:
            self.running = True
            self.update_thread = threading.Thread(target=self._monitor_orders)
            self.update_thread.daemon = True
            self.update_thread.start()

    def stop_monitoring(self):
        """Stop the order monitoring thread"""
        self.running = False
        if self.update_thread:
            self.update_thread.join()

    def _monitor_orders(self):
        """Monitor and automatically update order statuses"""
        while self.running:
            try:
                self._process_pending_orders()
                self._update_processing_orders()
                self._update_shipping_status()
                time.sleep(60)  # Check every minute
            except Exception as e:
                print(f"Error in order monitoring: {str(e)}")

    def _process_pending_orders(self):
        """Process orders in pending status"""
        if not AUTO_UPDATE_CONFIG['enable_auto_confirmation']:
            return

        pending_orders = self.db.orders.find({
            'status': ORDER_STATUSES['PENDING'],
            'created_at': {
                '$lt': datetime.utcnow() - timedelta(
                    seconds=AUTO_UPDATE_CONFIG['confirmation_delay']
                )
            }
        })

        for order in pending_orders:
            if self._verify_payment(order):
                self.update_order_status(
                    order['_id'],
                    ORDER_STATUSES['CONFIRMED'],
                    "Payment verified and order confirmed"
                )

    def _update_processing_orders(self):
        """Update status of processing orders"""
        processing_orders = self.db.orders.find({
            'status': ORDER_STATUSES['PROCESSING'],
            'last_updated': {
                '$lt': datetime.utcnow() - timedelta(
                    seconds=AUTO_UPDATE_CONFIG['update_intervals']['processing']
                )
            }
        })

        for order in processing_orders:
            # Check inventory and update shipping status
            if self._check_inventory(order):
                self.update_order_status(
                    order['_id'],
                    ORDER_STATUSES['SHIPPED'],
                    "Order has been shipped"
                )

    def _update_shipping_status(self):
        """Update shipping status for shipped orders"""
        if not AUTO_UPDATE_CONFIG['enable_shipping_updates']:
            return

        shipped_orders = self.db.orders.find({
            'status': ORDER_STATUSES['SHIPPED'],
            'last_updated': {
                '$lt': datetime.utcnow() - timedelta(
                    seconds=AUTO_UPDATE_CONFIG['update_intervals']['shipping']
                )
            }
        })

        for order in shipped_orders:
            shipping_status = self._check_shipping_status(order)
            if shipping_status == 'delivered':
                self.update_order_status(
                    order['_id'],
                    ORDER_STATUSES['DELIVERED'],
                    "Order has been delivered"
                )

    def update_order_status(self, order_id, new_status, message):
        """Update order status and send notifications"""
        order = self.db.orders.find_one_and_update(
            {'_id': order_id},
            {
                '$set': {
                    'status': new_status,
                    'last_updated': datetime.utcnow(),
                    'status_message': message
                }
            },
            return_document=True
        )

        if order and 'customer' in order:
            self._send_status_notification(order, new_status)

    def _send_status_notification(self, order, status):
        """Send status update notification to customer"""
        if 'sms' in AUTO_UPDATE_CONFIG['notification_channels']:
            template = self._get_sms_template(status)
            if template and order.get('customer', {}).get('phone'):
                message = template.format(
                    order_id=order['_id'],
                    amount=order.get('total_amount', 0),
                    tracking_url=f"https://yourshop.com/track/{order['_id']}",
                    delivery_date=(
                        datetime.utcnow() + timedelta(days=3)
                    ).strftime('%d-%m-%Y')
                )
                self.sms_service.send_sms(
                    order['customer']['phone'],
                    message
                )

    def _get_sms_template(self, status):
        """Get the appropriate SMS template for the order status"""
        template_map = {
            ORDER_STATUSES['CONFIRMED']: SMS_CONFIG['templates']['order_confirmed'],
            ORDER_STATUSES['SHIPPED']: SMS_CONFIG['templates']['order_shipped'],
            ORDER_STATUSES['DELIVERED']: SMS_CONFIG['templates']['order_delivered']
        }
        return template_map.get(status)

    def _verify_payment(self, order):
        """Verify payment status with payment gateway"""
        # Implement payment verification logic
        return True

    def _check_inventory(self, order):
        """Check if all items in order are available"""
        # Implement inventory check logic
        return True

    def _check_shipping_status(self, order):
        """Check shipping status with courier service"""
        # Implement shipping status check logic
        return 'in_transit'  # or 'delivered'

    def create_order(self, order_data):
        """Create a new order"""
        order = {
            **order_data,
            'created_at': datetime.utcnow(),
            'last_updated': datetime.utcnow(),
            'status': ORDER_STATUSES['PENDING'],
            'status_message': "Order placed successfully"
        }
        
        result = self.db.orders.insert_one(order)
        if result.inserted_id:
            self._send_status_notification(order, ORDER_STATUSES['PENDING'])
            return str(result.inserted_id)
        return None
