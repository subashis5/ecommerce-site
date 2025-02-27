import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          E-Commerce Store
        </Typography>
        <Button color="inherit" onClick={() => navigate('/products')}>Products</Button>
        <IconButton color="inherit" onClick={() => navigate('/cart')}>
          <Badge badgeContent={0} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>
        <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
        <Button
          color="inherit"
          component={Link}
          to="/contact"
          sx={{ ml: 2 }}
        >
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
