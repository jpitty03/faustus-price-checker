import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Box, CircularProgress, Chip, Button } from '@mui/material';
import { PricesContext } from '../context/PricesContext';
import FaustusPortrait from '../assets/Faustus_portrait.png';
import AllItems from '../assets/all_items.png';

const scarabIconUrl = 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/10856e6528/SuperScarab4.png';
const currencyIconUrl = 'https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvSGluZWtvcmFzTG9jayIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/9fe8aa2704/HinekorasLock.png';

export default function HeaderBar({
  onFilterScarabs,
  onFilterCurrency,
  onClearFilter
}) {
  const { loading, isLive, divinePrice } = useContext(PricesContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#0f0102', padding: '5px' }}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={FaustusPortrait}
              alt="Faustus Logo"
              sx={{ height: 60, width: 'auto', marginRight: 2 }}
            />
          </a>
          <Typography variant="h6" component="div" color="inherit">
            Faustus Price Checker
          </Typography>
        </Box>

        {/* All Items Filter */}
        <Button
          variant="contained"
          color="#0f0102"
          size="small"
          onClick={onClearFilter}
          sx={{
            marginRight: 1,
            textTransform: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2px'
          }}
        >
          {/* Icon */}
          <Box
            component="img"
            src={AllItems}
            alt="Currency Icon"
            sx={{ width: 35, height: 35, marginBottom: 0.1 }}
          />
          {/* Text */}
          <span>Show All</span>
        </Button>

        {/* Scarab Filter */}
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            color="#0f0102"
            size="small"
            onClick={onFilterScarabs}
            sx={{
              marginRight: 1,
              textTransform: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            {/* Icon */}
            <Box
              component="img"
              src={scarabIconUrl}
              alt="Scarab Icon"
              sx={{ width: 35, height: 35, marginBottom: 0.1 }}
            />
            {/* Text */}
            <span>Scarabs</span>
          </Button>

          {/* Currency Filter */}
          <Button
            variant="contained"
            color="#0f0102"
            size="small"
            onClick={onFilterCurrency}
            sx={{
              marginRight: 1,
              textTransform: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '2px'
            }}
          >
            {/* Icon */}
            <Box
              component="img"
              src={currencyIconUrl}
              alt="Currency Icon"
              sx={{ width: 35, height: 35, marginBottom: 0.1 }}
            />
            {/* Text */}
            <span>Currency</span>
          </Button>
        </Box>


        {/* Divine Orb Price Display */}
        <Box sx={{ marginRight: 2 }}>
          <Typography variant="body1">
            Divine Orb Price:{' '}
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              `${divinePrice} Chaos`
            )}
          </Typography>
        </Box>

        {/* WebSocket Connection Status */}
        <Chip
          label={isLive ? 'Live' : 'Disconnected'}
          color={isLive ? 'success' : 'error'}
          sx={{ fontWeight: 'bold' }}
        />
      </Toolbar>
    </AppBar >
  );
}

HeaderBar.propTypes = {
  onFilterScarabs: PropTypes.func.isRequired,
  onFilterCurrency: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired
};

