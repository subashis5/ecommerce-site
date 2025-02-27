import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Fade,
  Zoom,
  CardActionArea,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { useCart } from '../contexts/CartContext';

// Styled components
const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  overflow: 'hidden',
}));

const ProductImage = styled(CardMedia)({
  paddingTop: '75%',
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const PriceChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  zIndex: 1,
}));

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigating to product detail
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.name} added to cart!`,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error" variant="filled">
          {error}
          <Button color="inherit" size="small" onClick={fetchProducts} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {products.map((product, index) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Fade in={true} timeout={500 + index * 100}>
              <Box>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard>
                    <CardActionArea onClick={() => handleProductClick(product.id)}>
                      <Box sx={{ position: 'relative' }}>
                        <ProductImage
                          image={product.image_url}
                          title={product.name}
                        />
                        <PriceChip
                          label={`₹${product.price.toLocaleString()}`}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h2" noWrap>
                          {product.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 2,
                            minHeight: '40px',
                          }}
                        >
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <IconButton size="small" color="primary" onClick={(e) => e.stopPropagation()}>
                              <FavoriteIcon />
                            </IconButton>
                            <IconButton size="small" color="primary" onClick={(e) => e.stopPropagation()}>
                              <ShareIcon />
                            </IconButton>
                          </Box>
                          <Zoom in={true} timeout={500 + index * 100}>
                            <Button
                              variant="contained"
                              startIcon={<ShoppingCartIcon />}
                              onClick={(e) => handleAddToCart(e, product)}
                              sx={{ borderRadius: '20px' }}
                            >
                              Add to Cart
                            </Button>
                          </Zoom>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </ProductCard>
                </motion.div>
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;
