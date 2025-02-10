import React, { useContext, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { PricesContext } from '../context/PricesContext';
import { GetPriceGridColumns } from './PriceGridColumns';
import HeaderBar from './HeaderBar';

// Helper to apply the current filter to a data set
const applyFilter = (data, filter) => {
  if (filter === 'scarab') {
    return data.filter((row) => row.want_item_type === 'scarab');
  } else if (filter === 'currency') {
    return data.filter((row) => row.want_item_type === 'currency');
  }
  // "all"
  return data;
};

export default function PriceDataGrid() {
  const { prices, loading } = useContext(PricesContext);

  // Stores the full data from server (after sorting or initial load)
  const [masterRows, setMasterRows] = useState([]);
  // This is what the DataGrid actually displays (filtered subset)
  const [rows, setRows] = useState([]);

  // Remember the currently active filter: 'all', 'scarab', 'currency'
  const [activeFilter, setActiveFilter] = useState('all');

  const [sortModel, setSortModel] = useState([]);
  const columns = GetPriceGridColumns();

  // Whenever context "prices" changes (like on initial load or WS update),
  // we treat that as "master" data, then reapply any active filter.
  useEffect(() => {
    setMasterRows(prices);
    setRows(applyFilter(prices, activeFilter));
  }, [prices, activeFilter]);

  // ===== 1) LOCAL FILTER HANDLERS (buttons) =====

  const handleFilterScarabs = () => {
    setActiveFilter('scarab');
    setRows(applyFilter(masterRows, 'scarab'));
  };

  const handleFilterCurrency = () => {
    setActiveFilter('currency');
    setRows(applyFilter(masterRows, 'currency'));
  };

  const handleClearFilter = () => {
    setActiveFilter('all');
    setRows(applyFilter(masterRows, 'all'));
  };

  // ===== 2) SERVER-SIDE SORTING =====

  const handleSortModelChange = async (newSortModel) => {
    setSortModel(newSortModel);

    if (newSortModel.length === 0) {
      setMasterRows(prices);
      setRows(applyFilter(prices, activeFilter));
      return;
    }

    const { field, sort } = newSortModel[0];

    let baseUrl;
    if (process.env.NODE_ENV === 'development') {
      baseUrl = 'http://localhost:5001';
    } else {
      baseUrl = 'https://faustus-price-checker.onrender.com';
    }

    try {
      const response = await fetch(`${baseUrl}/api/prices/sort?field=${field}&sort=${sort}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error ${response.status}: ${text}`);
      }

      const sortedData = await response.json();

      // 1) Store the newly sorted data in masterRows
      setMasterRows(sortedData);

      // 2) Reapply the active filter to the sorted data
      const filtered = applyFilter(sortedData, activeFilter);
      setRows(filtered);

    } catch (error) {
      console.error('Error sorting data:', error);
    }
  };

  if (loading) {
    return <div>Loading prices...</div>;
  }

  return (
    <div style={{ height: '88vh', width: '100%' }}>
      <HeaderBar
        onFilterScarabs={handleFilterScarabs}
        onFilterCurrency={handleFilterCurrency}
        onClearFilter={handleClearFilter}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        sortModel={sortModel}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
