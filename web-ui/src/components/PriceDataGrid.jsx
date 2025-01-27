import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

// Flatten logic for prices.json
function flattenExchanges(pricesJson) {
  // pricesJson should look like:
  // {
  //   "updated": "2025-01-26T02:42:40.406188Z",
  //   "exchanges": [
  //       {
  //         "haveCurrency": "...",
  //         "wantCurrency": "...",
  //         "lastUpdated": "...",
  //         "offers": [...],
  //         "competingTrades": [...]
  //       },
  //       ...
  //   ]
  // }

  let rowId = 1;
  const rows = [];

  pricesJson.exchanges.forEach((exchange) => {
    const { haveCurrency, wantCurrency, lastUpdated, offers, competingTrades } = exchange;

    // If there's at least one offer, push the first
    if (offers && offers.length > 0) {
      const firstOffer = offers[0];
      rows.push({
        id: rowId++,
        rowType: "offer",
        haveCurrency,
        wantCurrency,
        lastUpdated,
        haveAmount: firstOffer.haveAmount,
        wantAmount: firstOffer.wantAmount,
        stock: firstOffer.stock
      });
    }

    // If there's at least one competing, push the first
    if (competingTrades && competingTrades.length > 0) {
      const firstCompeting = competingTrades[0];
      rows.push({
        id: rowId++,
        rowType: "competing",
        haveCurrency,
        wantCurrency,
        lastUpdated,
        haveAmount: firstCompeting.haveAmount,
        wantAmount: firstCompeting.wantAmount,
        stock: firstCompeting.stock
      });
    }
  });

  return rows;
}

export default function PriceDataGrid() {
  const [rows, setRows] = useState([]);
  const [currencyIconMap, setCurrencyIconMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both currencyOverview.json (for icons) and prices.json (for exchange data).
    Promise.all([
      fetch("/faustusPrices.json").then((res) => res.json()),
      fetch("/faustusPrices.json").then((res) => res.json())
    ])
      .then(([ninjaData, pricesData]) => {
        console.log("Fetched JSON Ninja files:", ninjaData);
        console.log("Fetched JSON faustusPrices files:", pricesData);
        // 1. Build icon map from the currencyOverview
        const iconMap = {};
        if (ninjaData.currencyDetails) {
          ninjaData.currencyDetails.forEach((c) => {
            iconMap[c.name] = c.icon;
          });
        }

        // 2. Flatten the newly fetched prices.json
        const flattenedRows = flattenExchanges(pricesData);

        // 3. Update state
        setCurrencyIconMap(iconMap);
        setRows(flattenedRows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching JSON files:", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      field: "haveCurrency",
      headerName: "Have Currency",
      width: 200,
      renderCell: (params) => {
        const currencyName = params.value;
        const iconUrl = currencyIconMap[currencyName];
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {iconUrl && (
              <img
                src={iconUrl}
                alt={currencyName}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            )}
            {currencyName}
          </div>
        );
      }
    },
    { field: "wantCurrency", headerName: "Want Currency", width: 130 },
    { field: "lastUpdated", headerName: "Last Updated", width: 180 },
    { field: "rowType", headerName: "Type", width: 100 },
    { field: "haveAmount", headerName: "Have Amt", type: "number", width: 100 },
    { field: "wantAmount", headerName: "Want Amt", type: "number", width: 100 },
    { field: "stock", headerName: "Stock", type: "number", width: 100 }
  ];

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div style={{ height: 800, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
}
