import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the message to a backend
    setSnackbar({
      open: true,
      message: 'Message sent successfully!',
      severity: 'success'
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Our Information
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    Subashis Palai
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhoneIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    +91 7735587118
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    subashispalai@gmail.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOnIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    Bhubaneswar, Odisha, India
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Connect With Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://linkedin.com" 
                  target="_blank"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://github.com" 
                  target="_blank"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://instagram.com" 
                  target="_blank"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton 
                  color="primary" 
                  component="a" 
                  href="https://twitter.com" 
                  target="_blank"
                  aria-label="Twitter"
                >
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Send us a Message
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                required
                multiline
                rows={4}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendIcon />}
                sx={{ mt: 3 }}
                fullWidth
              >
                Send Message
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
