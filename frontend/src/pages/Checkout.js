import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const PAYMENT_METHODS = {
  UPI: 'upi',
  CARD: 'card',
  COD: 'cod'
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const validateCustomerInfo = () => {
    const { name, email, phone, address } = customerInfo;
    if (!name || !email || !phone || !address) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateCustomerInfo()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getCartTotal(),
          currency: 'INR',
          customer: customerInfo
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create order');
      return data;
    } catch (error) {
      throw new Error('Failed to create order: ' + error.message);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (paymentMethod === PAYMENT_METHODS.COD) {
        // Handle COD
        await handleCashOnDelivery();
        return;
      }

      const res = await initializeRazorpay();
      if (!res) {
        throw new Error('Razorpay SDK failed to load');
      }

      const order = await createOrder();
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop Name",
        description: "Purchase Payment",
        order_id: order.id,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              clearCart();
              navigate('/order-success', { 
                state: { 
                  orderId: order.id,
                  paymentId: response.razorpay_payment_id 
                }
              });
            }
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment cancelled');
            setLoading(false);
          },
        },
        theme: {
          color: "#3f51b5",
        },
      };

      if (paymentMethod === PAYMENT_METHODS.UPI) {
        options.method = 'upi';
        options.upi = {
          flow: 'collect',
          vpa: '7735587118@fam'
        };
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      // Create COD order
      const response = await fetch('http://localhost:5000/api/create-cod-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getCartTotal(),
          customer: customerInfo
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: data.orderId,
          paymentMethod: 'COD'
        }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Customer Information', 'Payment Method', 'Confirm Order'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  multiline
                  rows={3}
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <FormControlLabel
                value={PAYMENT_METHODS.UPI}
                control={<Radio />}
                label="UPI (PhonePe/Google Pay)"
              />
              <FormControlLabel
                value={PAYMENT_METHODS.CARD}
                control={<Radio />}
                label="Credit/Debit Card"
              />
              <FormControlLabel
                value={PAYMENT_METHODS.COD}
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ mb: 1 }}>
                  <Typography>
                    {item.name} x {item.quantity} - ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ₹{getCartTotal().toLocaleString()}
              </Typography>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Delivery Information
            </Typography>
            <Typography>{customerInfo.name}</Typography>
            <Typography>{customerInfo.phone}</Typography>
            <Typography>{customerInfo.email}</Typography>
            <Typography>{customerInfo.address}</Typography>
            
            <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
              Payment Method
            </Typography>
            <Typography>
              {paymentMethod === PAYMENT_METHODS.UPI && 'UPI Payment'}
              {paymentMethod === PAYMENT_METHODS.CARD && 'Card Payment'}
              {paymentMethod === PAYMENT_METHODS.COD && 'Cash on Delivery'}
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || loading}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePayment}
                disabled={!paymentMethod || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
