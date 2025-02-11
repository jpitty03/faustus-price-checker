import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import { PricesProvider } from './context/PricesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9'
    },
    secondary: {
      main: '#0f0102'
    },
    background: {
      default: '#0f0102',
      paper: '#1d1d1d'
    },
    text: {
      primary: '#ffffff'
    }
  }
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PricesProvider>
        <App />
      </PricesProvider>
    </ThemeProvider>
  </React.StrictMode>
);
