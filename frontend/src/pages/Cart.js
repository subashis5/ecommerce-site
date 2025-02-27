import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Grid,
  Divider,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  mb: 2,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image={item.image_url}
                  alt={item.name}
                />
                <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ₹{item.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      sx={{ ml: 2 }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              position: 'sticky',
              top: 24,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{getCartTotal().toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">₹{getCartTotal().toLocaleString()}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
