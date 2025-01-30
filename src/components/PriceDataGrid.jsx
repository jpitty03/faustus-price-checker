import React, { useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { PricesContext } from "../context/PricesContext"; // Import Context
import { getPriceGridColumns } from "./PriceGridColumns";

export default function PriceDataGrid() {
  const { prices, loading } = useContext(PricesContext); // Get prices from context
  console.log("Prices:", prices);

  if (loading) {
    return <div>Loading prices...</div>;
  }

  return (
    <div style={{ height: 600, width: "100%", marginTop: 16 }}>
      <DataGrid
        rows={prices}
        columns={getPriceGridColumns()}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        disableSelectionOnClick
      />
    </div>
  );
}
