import React, { useContext} from 'react';
import { Box, Tooltip } from '@mui/material';
import { PricesContext } from '../context/PricesContext';
import InfoIcon from '@mui/icons-material/Info';

// Function to return column definitions
export const GetPriceGridColumns = () => {
  const {divinePrice} = useContext(PricesContext);

  function convertToChaos(haveCurrency, haveAmount) {
    const conversionRates = {
      'Chaos Orb': 1,
      'Divine Orb': divinePrice
    };
    if (conversionRates[haveCurrency]) {
      return conversionRates[haveCurrency] * haveAmount;
    }
    return null;
  }

  const columns =  [
    {
      field: 'have_currency',
      headerName: 'Have',
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <img
            src={params.row.have_currency_icon}
            alt={params.value}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          {params.row.have_amount} {params.value}
        </Box>
      )
    },
    {
      field: 'want_currency',
      headerName: 'Want',
      width: 300,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <img
            src={params.row.want_currency_icon}
            alt={params.value}
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          {params.row.want_amount} {params.value}
        </Box>
      )
    },
    {
      field: 'trade_type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => {
        const tradeType = params.value;

        // Define tooltip messages
        const tooltipMessages = {
          competing: 'Indicates an exchange where the Have currency is listed, but the trade requires a seller to fulfill it.',
          offer: 'Indicates an exchange where the Have currency can be traded instantly for the Want currency.'
        };

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{tradeType}</span>
            {tooltipMessages[tradeType] && (
              <Tooltip title={tooltipMessages[tradeType]} arrow>
                <InfoIcon fontSize="small" style={{ marginLeft: 5, cursor: 'pointer', color: '#555' }} />
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      width: 70,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
            <span>{params.value}</span>
          </div>
        );
      }
    },
    {
      field: 'ninja_price',
      headerName: 'Ninja Price',
      type: 'number',
      width: 130,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
            <span>{params.value}</span>
            <Tooltip title="PoE Ninja price of Want" arrow>
              <InfoIcon fontSize="small" style={{ marginLeft: 5, cursor: 'pointer', color: '#555' }} />
            </Tooltip>

          </div>
        );
      }
    },
    {
      field: 'arbitrage',
      headerName: 'Arbitrage',
      width: 180,
      // Add a numeric value for sorting
      valueGetter: (value, row) => {
        if (!row) {return null;}
        
        const costInChaos = convertToChaos(row.have_currency, row.have_amount);
        const resultInChaos = row.want_currency === 'Chaos Orb' 
          ? row.want_amount
          : row.want_amount * row.ninja_price;
    
        if (!costInChaos || !resultInChaos) {return null;}
        
        return resultInChaos - costInChaos;
      },
      renderCell: (params) => {
        const row = params.row;
        const { have_currency, have_amount, want_currency, want_amount, ninja_price } = row;
    
        // 1) Convert "Have" to Chaos
        const costInChaos = convertToChaos(have_currency, have_amount);
    
        // 2) Convert "Want" to Chaos
        let resultInChaos = null;
        if (want_currency === 'Chaos Orb') {
          resultInChaos = want_amount;
        } else {
          resultInChaos = want_amount * ninja_price;
        }
    
        // If we can't calculate either, show "N/A"
        if (costInChaos === null || resultInChaos === null) {
          return 'N/A';
        }
    
        const difference = resultInChaos - costInChaos;
        const pct = (difference / costInChaos) * 100;
        const sign = difference >= 0 ? '+' : '';
        return `${sign}${difference.toFixed(1)} Chaos (${sign}${pct.toFixed(1)}%)`;
      }
    },
    {
      field: 'last_updated',
      headerName: 'Last Updated',
      width: 180,
      renderCell: (params) => new Date(params.value).toLocaleString()
    }
  ];

  return columns;
};