import React, { useContext, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PricesContext } from '../context/PricesContext';
import { GetPriceGridColumns } from './PriceGridColumns';

export default function PriceDataGrid() {
  const { prices, loading } = useContext(PricesContext);
  const [sortModel, setSortModel] = useState([]);
  // Local state to hold whichever data we want displayed
  const [rows, setRows] = useState([]);

  const columns = GetPriceGridColumns();

  // Whenever `prices` (from context) changes, reset rows to the full unsorted list
  useEffect(() => {
    setRows(prices);
  }, [prices]);

  const handleSortModelChange = async (newSortModel) => {
    setSortModel(newSortModel);
    
    if (newSortModel.length === 0) {return;}
  
    const { field, sort } = newSortModel[0];
  
    // 1) Determine correct base URL
    let baseUrl;
    if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:5001';
    } else {
      baseUrl = 'https://faustus-price-checker.onrender.com';
    }
  
    // 2) Fetch from that server
    try {
      const response = await fetch(`${baseUrl}/api/prices/sort?field=${field}&sort=${sort}`);
      if (!response.ok) {
        // E.g. 404 or 500
        const text = await response.text();
        throw new Error(`HTTP error ${response.status}: ${text}`);
      }
      const sortedData = await response.json();
      setRows(sortedData);
    } catch (error) {
      console.error('Error sorting data:', error);
    }
  };

  if (loading) {
    return <div>Loading prices...</div>;
  }

  return (
    <div style={{ height: '88vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        slots={{ toolbar: GridToolbar }}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        sortModel={sortModel}
      />
    </div>
  );
}
