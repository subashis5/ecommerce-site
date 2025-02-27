import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.2,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
}));

const ProductShowcase = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '16px',
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const ShowcaseImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
});

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Shopping',
      description: 'Browse through our extensive collection of premium products',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Get your products delivered quickly and securely',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Payments',
      description: 'Shop with confidence using our secure payment system',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Support',
      description: 'Our customer support team is always here to help',
    },
  ];

  const showcaseProducts = [
    {
      image: 'https://m.media-amazon.com/images/I/81dT7CUY6GL._SL1500_.jpg',
      title: 'Latest iPhones',
      description: 'Experience the power of the latest iPhone 15 Pro Max',
    },
    {
      image: 'https://m.media-amazon.com/images/I/61LNGJEMh0L._SL1500_.jpg',
      title: 'MacBook Pro',
      description: 'Unleash your creativity with the M3 Max chip',
    },
    {
      image: 'https://m.media-amazon.com/images/I/61vJtKbAssL._SL1500_.jpg',
      title: 'Premium Audio',
      description: 'Immerse yourself in crystal-clear sound',
    },
  ];

  return (
    <Box>
      <HeroSection>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h2" component="h1" gutterBottom>
                  Welcome to TechHub
                </Typography>
                <Typography variant="h5" paragraph>
                  Discover the latest in technology and premium electronics
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{
                    mt: 2,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  Shop Now
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="https://m.media-amazon.com/images/I/71YdE55GwjL._SL1500_.jpg"
                  alt="Featured Product"
                  style={{ width: '100%', borderRadius: '16px' }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Fade in={true} timeout={500 + index * 100}>
                <Box>
                  <FeatureCard>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {showcaseProducts.map((product, index) => (
              <Grid item xs={12} md={4} key={product.title}>
                <Zoom in={true} timeout={500 + index * 200}>
                  <ProductShowcase>
                    <ShowcaseImage src={product.image} alt={product.title} />
                    <CardContent
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {product.title}
                      </Typography>
                      <Typography variant="body2">
                        {product.description}
                      </Typography>
                    </CardContent>
                  </ProductShowcase>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
