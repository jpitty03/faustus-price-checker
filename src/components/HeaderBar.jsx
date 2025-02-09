import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, CircularProgress, Chip } from '@mui/material';
import { PricesContext } from '../context/PricesContext';

export default function HeaderBar() {
  const { prices, loading, isLive } = useContext(PricesContext);

  // Find Divine Orb price
  const divineOrb = prices.find((price) => price.want_currency === 'Divine Orb');
  const divineOrbPrice = divineOrb ? divineOrb.ninja_price : 'N/A';

  return (
    <AppBar position="static" sx={{ backgroundColor: '#212121', padding: '5px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Faustus Price Checker
        </Typography>

        {/* Divine Orb Price Display */}
        <Box sx={{ marginRight: 2 }}>
          <Typography variant="body1">
            Divine Orb Price: {loading ? <CircularProgress size={16} color="inherit" /> : `${divineOrbPrice} Chaos`}
          </Typography>
        </Box>

        {/* WebSocket Connection Status */}
        <Chip
          label={isLive ? 'Live' : 'Disconnected'}
          color={isLive ? 'success' : 'error'}
          sx={{ fontWeight: 'bold' }}
        />
      </Toolbar>
    </AppBar>
  );
}
