import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Zoom,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

const ProductImage = styled(motion.img)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
}));

const SpecCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating] = useState(4.5); // This would come from your backend in a real app

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details. Please try again later.');
    } finally {
      setLoading(false);
    }
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
        </Alert>
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Zoom in={true} timeout={500}>
            <Box>
              <ProductImage
                src={product.image_url}
                alt={product.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </Box>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={rating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({rating} / 5)
                </Typography>
                <Chip
                  icon={<VerifiedIcon />}
                  label="Verified Product"
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>

              <Typography variant="h4" color="primary" gutterBottom>
                ₹{product.price.toLocaleString()}
              </Typography>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon color="primary" />
                      <Typography variant="body2">Free Delivery</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon color="primary" />
                      <Typography variant="body2">1 Year Warranty</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                Add to Cart
              </Button>
            </Box>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
            Specifications
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {product.specifications && Object.entries(product.specifications).map(([key, value], index) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Fade in={true} timeout={500 + index * 100}>
                  <SpecCard elevation={2}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant="body1">
                      {value}
                    </Typography>
                  </SpecCard>
                </Fade>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
              Technical Details
            </Typography>
            <Divider sx={{ mb: 4 }} />
            
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableBody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row" sx={{ width: '30%', bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{value}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
