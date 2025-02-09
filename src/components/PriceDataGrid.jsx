import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { PricesContext } from '../context/PricesContext';
import { getPriceGridColumns } from './PriceGridColumns';

export default function PriceDataGrid() {

  const { prices, loading } = useContext(PricesContext);

  if (loading) {
    return <div>Loading prices...</div>;
  }

  return (

    <div style={{ height: '88vh', width: '100%' }}>
      <DataGrid
        rows={prices}
        columns={getPriceGridColumns()}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
}

