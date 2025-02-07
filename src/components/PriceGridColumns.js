import { Box } from "@mui/material";

// Function to return column definitions
export const getPriceGridColumns = () => [
    {
        field: "have_currency",
        headerName: "Have",
        width: 200,
        renderCell: (params) => (
            <Box display="flex" alignItems="center">
                <img
                    src={params.row.have_currency_icon}
                    alt={params.value}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {params.row.want_amount} {params.value}
            </Box>
        ),
    },
    {
        field: "want_currency",
        headerName: "Want",
        width: 200,
        renderCell: (params) => (
            <Box display="flex" alignItems="center">
                <img
                    src={params.row.want_currency_icon}
                    alt={params.value}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {params.row.have_amount} {params.value}
            </Box>
        ),
    },
    {
        field: "trade_type",
        headerName: "Type",
        width: 100
    },
    {
        field: "stock",
        headerName: "Stock",
        type: "number",
        width: 100
    },
    {
        field: "ninja_price",
        headerName: "Ninja Price",
        type: "number",
        width: 130,
        renderCell: (params) => `${params.value} Chaos`,
    },
    {
        field: "last_updated",
        headerName: "Last Updated",
        width: 180,
        renderCell: (params) => new Date(params.value).toLocaleString(),
    },
];

