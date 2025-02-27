import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 16px 70px -12px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px -8px rgba(0,0,0,0.3)',
          },
        },
        contained: {
          boxShadow: '0 4px 12px -4px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 8px 30px -6px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 4px -1px rgba(0,0,0,0.06), 0px 4px 6px -1px rgba(0,0,0,0.1)',
    '0px 4px 6px -2px rgba(0,0,0,0.05), 0px 10px 15px -3px rgba(0,0,0,0.1)',
    // ... add more custom shadows for different elevations
    '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)',
  ],
});

export default theme;
