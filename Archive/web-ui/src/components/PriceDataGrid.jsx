import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getColumns } from "./ColDefs";

// Helper: Build Currency Map
function buildCurrencyMap(ninjaData) {
  const linesMap = {}; // Map for chaosEquivalent data

  // Build a map from "lines"
  if (ninjaData && ninjaData.lines) {
    ninjaData.lines.forEach((line) => {
      const name = line.currencyTypeName;
      linesMap[name] = {
        chaosEquivalent: line.chaosEquivalent || 0,
        pay: line.pay,
        receive: line.receive,
      };
    });
  }

  const mergedMap = {};

  // Merge with currencyDetails
  if (ninjaData && ninjaData.currencyDetails) {
    ninjaData.currencyDetails.forEach((c) => {
      const name = c.name;
      const icon = c.icon;
      const lineObj = linesMap[name] || {};

      mergedMap[name] = {
        icon,
        chaosEquivalent: lineObj.chaosEquivalent || 0,
        tradeId: c.tradeId,
      };
    });
  }

  return mergedMap;
}

// // Helper: Define Columns
// function getColumns(currencyIconMap) {
//   return [
//     {
//       field: "haveCurrency",
//       headerName: "Have Currency",
//       width: 250,
//       renderCell: (params) => {
//         const currencyName = params.value;
//         const amount = params.row.haveAmount;
//         const iconUrl = currencyIconMap[currencyName]?.icon;
//         return (
//           <div style={{ display: "flex", alignItems: "center" }}>
//             <span style={{ marginRight: 8 }}>{amount}</span>
//             {iconUrl && (
//               <img
//                 src={iconUrl}
//                 alt={currencyName}
//                 style={{ width: 24, height: 24, marginRight: 8 }}
//               />
//             )}
//             <span>{currencyName}</span>
//           </div>
//         );
//       },
//     },
//     { field: "wantCurrency", headerName: "Want Currency", width: 150 },
//     { field: "lastUpdated", headerName: "Last Updated", width: 180 },
//     { field: "rowType", headerName: "Type", width: 100 },
//     { field: "haveAmount", headerName: "Have Amt", type: "number", width: 100 },
//     { field: "wantAmount", headerName: "Want Amt", type: "number", width: 100 },
//     { field: "stock", headerName: "Stock", type: "number", width: 100 },
//   ];
// }

// Helper: Flatten Exchanges
function flattenExchanges(pricesJson) {
  if (!pricesJson || !pricesJson.exchanges) {
    console.error("Invalid data structure received:", pricesJson);
    return [];
  }

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
        haveCurrency: haveCurrency,
        wantCurrency,
        lastUpdated,
        haveAmount: firstOffer.wantAmount,
        wantAmount: firstOffer.haveAmount,
        stock: firstOffer.stock,
      });
    }

    // If there's at least one competing trade, push the first
    if (competingTrades && competingTrades.length > 0) {
      const firstCompeting = competingTrades[0];
      rows.push({
        id: rowId++,
        rowType: "competing",
        haveCurrency,
        wantCurrency,
        lastUpdated,
        haveAmount: firstCompeting.wantAmount,
        wantAmount: firstCompeting.haveAmount,
        stock: firstCompeting.stock,
      });
    }
  });

  return rows;
}

// Main Component
export default function PriceDataGrid() {
  const [rows, setRows] = useState([]);
  const [currencyIconMap, setCurrencyIconMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch currencyOverview.json (Ninja data)
    fetch("/faustus-price-checker/currencyOverview.json")
      .then((res) => res.json())
      .then((ninjaData) => {
        const mergedMap = buildCurrencyMap(ninjaData);
        setCurrencyIconMap(mergedMap);

        // Console log after processing currencyOverview
        console.log("Merged Currency Map (Icons & Chaos Equivalents):", mergedMap);

        // Fetch faustusPrices.json
        return fetch("/faustus-price-checker/faustusPrices.json");
      })
      .then((res) => res.json())
      .then((pricesData) => {
        const flattenedRows = flattenExchanges(pricesData);
        setRows(flattenedRows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const columns = getColumns(currencyIconMap);

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
