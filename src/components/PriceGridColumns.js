import { Box, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

// Function to return column definitions
export const getPriceGridColumns = () => [
    {
        field: "have_currency",
        headerName: "Have",
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
        ),
    },
    {
        field: "want_currency",
        headerName: "Want",
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
        ),
    },
    {
        field: "trade_type",
        headerName: "Type",
        width: 130,
        renderCell: (params) => {
            const tradeType = params.value;

            // Define tooltip messages
            const tooltipMessages = {
                competing: "Indicates an exchange where the Have currency is listed, but the trade requires a seller to fulfill it.",
                offer: "Indicates an exchange where the Have currency can be traded instantly for the Want currency.",
            };

            return (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{tradeType}</span>
                    {tooltipMessages[tradeType] && (
                        <Tooltip title={tooltipMessages[tradeType]} arrow>
                            <InfoIcon fontSize="small" style={{ marginLeft: 5, cursor: "pointer", color: "#555" }} />
                        </Tooltip>
                    )}
                </div>
            );
        }
    },
    {
        field: "stock",
        headerName: "Stock",
        type: "number",
        width: 70,
        renderCell: (params) => {
            return (
                <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                    <span>{params.value}</span>
                </div>
            );
        }
    },
    {
        field: "ninja_price",
        headerName: "Ninja Price",
        type: "number",
        width: 130,
        renderCell: (params) => {
            return (
                <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                    <span>{params.value}</span>
                    <Tooltip title="PoE Ninja price of Want" arrow>
                        <InfoIcon fontSize="small" style={{ marginLeft: 5, cursor: "pointer", color: "#555" }} />
                    </Tooltip>

                </div>
            );
        }
    },
    {
        field: "PoE Ninja/Exchange Ratio",
        headerName: "Last Updated",
        width: 180,
        renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
        field: "last_updated",
        headerName: "Last Updated",
        width: 180,
        renderCell: (params) => new Date(params.value).toLocaleString(),
    },
];

