import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",  // a lighter blue for dark backgrounds
    },
    secondary: {
      main: "#f48fb1",  // pink accent
    },
    background: {
      default: "#121212", // typical dark background
      paper: "#1d1d1d"
    },
    text: {
      primary: "#ffffff"  // ensures text is readable against dark background
    }
  }
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    </ThemeProvider>
  </React.StrictMode>
);
