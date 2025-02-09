import React, { useContext } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PricesContext } from '../context/PricesContext';
import { GetPriceGridColumns } from './PriceGridColumns';

export default function PriceDataGrid() {
  const { prices, loading } = useContext(PricesContext);

  const columns = GetPriceGridColumns();

  if (loading) {
    return <div>Loading prices...</div>;
  }

  return (
    <div style={{ height: '88vh', width: '100%' }}>
      <DataGrid
        rows={prices}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}

