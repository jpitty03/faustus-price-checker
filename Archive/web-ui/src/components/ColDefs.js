// priceGridColumns.js

export const getColumns = (currencyIconMap) => [
    {
        field: "haveCurrency",
        headerName: "Have Currency",
        width: 200,
        renderCell: (params) => {
            const currencyName = params.value;
            const amount = params.row.haveAmount;
            const iconUrl = currencyIconMap[currencyName]?.icon;
            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: 8 }}>{amount}</span>
                    {iconUrl && (
                        <img
                            src={iconUrl}
                            alt={currencyName}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                    )}
                    <span>{currencyName}</span>
                </div>
            );
        },
    },
    // {
    //     field: "haveAmount",
    //     headerName: "Have Amt",
    //     type: "number",
    //     width: 100
    // },
    {
        field: "wantCurrency",
        headerName: "Want Currency",
        width: 200,
        renderCell: (params) => {
            const currencyName = params.value;
            const amount = params.row.wantAmount;
            const iconUrl = currencyIconMap[currencyName]?.icon;
            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: 8 }}>{amount}</span>
                    {iconUrl && (
                        <img
                            src={iconUrl}
                            alt={currencyName}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                    )}
                    <span>{currencyName}</span>
                </div>
            );
        },
    },
    {
        field: "stock",
        headerName: "Stock",
        type: "number",
        width: 100
    },
    // {
    //     field: "wantAmount",
    //     headerName: "Want Amt",
    //     type: "number",
    //     width: 100
    // },
    {
        field: "rowType",
        headerName: "Type",
        width: 100
    },
    {
        field: "ninjaPrice",
        headerName: "Ninja Price",
        type: "number",
        width: 150,
        renderCell: (params) => {
            const currencyName = params.row.wantCurrency;
            const chaosEquivalent = currencyIconMap[currencyName]?.chaosEquivalent || "N/A";
            const iconUrl = currencyIconMap['Chaos Orb']?.icon;

            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {iconUrl && (
                        <img
                            src={iconUrl}
                            alt={currencyName}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                    )}
                    <span>{chaosEquivalent}</span>
                </div>
            );
        },
    },
    {
        field: "lastUpdated",
        headerName: "Last Updated",
        width: 180,
        renderCell: (params) => {
            const date = new Date(params.value);
            return date.toLocaleDateString('en-US', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }
];

export default function buildCurrencyMap(ninjaData) {
    // ninjaData looks like:
    // {
    //   "lines": [
    //     { "currencyTypeName": "Divine Orb", "chaosEquivalent": 170.05, ... },
    //     ...
    //   ],
    //   "currencyDetails": [
    //     { "id": 3, "icon": "...", "name": "Divine Orb", "tradeId": "divine" },
    //     ...
    //   ]
    // }

    const linesMap = {};  // For quick lookup of chaosEquivalent (and more) by currency name

    // 1) Build a map from "Divine Orb" => { chaosEquivalent, lines data, etc. }
    if (ninjaData.lines) {
        ninjaData.lines.forEach((line) => {
            const name = line.currencyTypeName; // e.g. "Divine Orb"
            linesMap[name] = {
                chaosEquivalent: line.chaosEquivalent,
                // You could store other fields like pay/receive if desired
                // pay: line.pay,
                // receive: line.receive
            };
        });
    }

    // 2) Now merge with "currencyDetails"
    const mergedMap = {};

    if (ninjaData.currencyDetails) {
        ninjaData.currencyDetails.forEach((c) => {
            const name = c.name; // e.g. "Divine Orb"
            const icon = c.icon;
            const lineObj = linesMap[name] || {};

            // mergedMap["Divine Orb"] = { icon, chaosEquivalent, ... }
            mergedMap[name] = {
                icon,
                chaosEquivalent: lineObj.chaosEquivalent || 0, // fallback if not found
                tradeId: c.tradeId,
                // ... any other fields you want
            };
        });
    }

    return mergedMap;
}