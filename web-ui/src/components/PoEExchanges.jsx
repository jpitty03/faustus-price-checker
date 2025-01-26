import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Container,
  Box
} from "@mui/material";

const priceData = {
    "updated": "2025-01-26T02:42:40.406188Z",
    "exchanges": [
        {
            "haveCurrency": "Chaos Orb",
            "wantCurrency": "Divine Orb",
            "lastUpdated": "2025-01-24T06:05:24.181317Z",
            "offers": [
                {
                    "haveAmount": 1.0,
                    "wantAmount": 180.0,
                    "stock": 1
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 183.0,
                    "stock": 2
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 185.0,
                    "stock": 37
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 187.0,
                    "stock": 1
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 188.0,
                    "stock": 100
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 188.0,
                    "stock": 395
                }
            ],
            "competingTrades": [
                {
                    "haveAmount": 1.0,
                    "wantAmount": 175.0,
                    "stock": 175
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 171.0,
                    "stock": 8037
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 170.0,
                    "stock": 2210
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 169.0,
                    "stock": 507
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 168.0,
                    "stock": 1008
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 168.0,
                    "stock": 895696
                }
            ]
        },
        {
            "haveCurrency": "Divine Orb",
            "wantCurrency": "Orb of Alteration",
            "lastUpdated": "2025-01-24T22:40:41.168435Z",
            "offers": [
                {
                    "haveAmount": 6.0,
                    "wantAmount": 1.0,
                    "stock": 2676
                },
                {
                    "haveAmount": 5.0,
                    "wantAmount": 1.0,
                    "stock": 3730
                },
                {
                    "haveAmount": 4.25,
                    "wantAmount": 1.0,
                    "stock": 30
                },
                {
                    "haveAmount": 4.0,
                    "wantAmount": 1.0,
                    "stock": 392
                },
                {
                    "haveAmount": 3.54,
                    "wantAmount": 1.0,
                    "stock": 280
                },
                {
                    "haveAmount": 3.54,
                    "wantAmount": 1.0,
                    "stock": 29889
                }
            ],
            "competingTrades": [
                {
                    "haveAmount": 9.98,
                    "wantAmount": 1.0,
                    "stock": 200
                },
                {
                    "haveAmount": 9.99,
                    "wantAmount": 1.0,
                    "stock": 200
                },
                {
                    "haveAmount": 10.0,
                    "wantAmount": 1.0,
                    "stock": 4239
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 1.0,
                    "stock": 10
                },
                {
                    "haveAmount": 12.0,
                    "wantAmount": 1.0,
                    "stock": 41
                },
                {
                    "haveAmount": 12.0,
                    "wantAmount": 1.0,
                    "stock": 799
                }
            ]
        },
        {
            "haveCurrency": "Chaos Orb",
            "wantCurrency": "Orb of Alteration",
            "lastUpdated": "2025-01-24T22:41:40.395883Z",
            "offers": [
                {
                    "haveAmount": 7.0,
                    "wantAmount": 1.0,
                    "stock": 21
                },
                {
                    "haveAmount": 6.0,
                    "wantAmount": 1.0,
                    "stock": 2676
                },
                {
                    "haveAmount": 5.0,
                    "wantAmount": 1.0,
                    "stock": 3730
                },
                {
                    "haveAmount": 4.25,
                    "wantAmount": 1.0,
                    "stock": 30
                },
                {
                    "haveAmount": 4.0,
                    "wantAmount": 1.0,
                    "stock": 392
                },
                {
                    "haveAmount": 4.0,
                    "wantAmount": 1.0,
                    "stock": 30169
                }
            ],
            "competingTrades": [
                {
                    "haveAmount": 9.98,
                    "wantAmount": 1.0,
                    "stock": 200
                },
                {
                    "haveAmount": 9.99,
                    "wantAmount": 1.0,
                    "stock": 200
                },
                {
                    "haveAmount": 10.0,
                    "wantAmount": 1.0,
                    "stock": 4239
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 1.0,
                    "stock": 10
                },
                {
                    "haveAmount": 12.0,
                    "wantAmount": 1.0,
                    "stock": 41
                },
                {
                    "haveAmount": 12.0,
                    "wantAmount": 1.0,
                    "stock": 799
                }
            ]
        },
        {
            "haveCurrency": "Chaos Orb",
            "wantCurrency": "Orb of Regret",
            "lastUpdated": "2025-01-26T02:42:40.406188Z",
            "offers": [
                {
                    "haveAmount": 1.25,
                    "wantAmount": 1.0,
                    "stock": 2860
                },
                {
                    "haveAmount": 1.1,
                    "wantAmount": 1.0,
                    "stock": 2541
                },
                {
                    "haveAmount": 1.08,
                    "wantAmount": 1.0,
                    "stock": 65
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 1.0,
                    "stock": 12
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 1.17,
                    "stock": 1226
                },
                {
                    "haveAmount": 1.0,
                    "wantAmount": 1.17,
                    "stock": 9420
                }
            ],
            "competingTrades": [
                {
                    "haveAmount": 4.0,
                    "wantAmount": 1.0,
                    "stock": 1
                },
                {
                    "haveAmount": 15.0,
                    "wantAmount": 1.0,
                    "stock": 80
                },
                {
                    "haveAmount": 7.0,
                    "wantAmount": 1.0,
                    "stock": 1
                },
                {
                    "haveAmount": 20.0,
                    "wantAmount": 1.0,
                    "stock": 6
                },
                {
                    "haveAmount": 25.0,
                    "wantAmount": 1.0,
                    "stock": 6
                },
                {
                    "haveAmount": 25.0,
                    "wantAmount": 1.0,
                    "stock": 22
                }
            ]
        }
    ]
}

function OffersTable({ offers }) {
    if (!offers || offers.length === 0) {
      return <Typography>No offers available</Typography>;
    }
  
    return (
      <Table size="small" sx={{ mt: 1, mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Have Amount</TableCell>
            <TableCell>Want Amount</TableCell>
            <TableCell>Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((offer, idx) => (
            <TableRow key={idx}>
              <TableCell>{offer.haveAmount}</TableCell>
              <TableCell>{offer.wantAmount}</TableCell>
              <TableCell>{offer.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  
  function ExchangeCard({ exchange }) {
    const { haveCurrency, wantCurrency, lastUpdated, offers, competingTrades } =
      exchange;
  
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {haveCurrency} → {wantCurrency}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: {lastUpdated}
          </Typography>
  
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Offers
          </Typography>
          <OffersTable offers={offers} />
  
          <Typography variant="subtitle1">Competing Trades</Typography>
          <OffersTable offers={competingTrades} />
        </CardContent>
      </Card>
    );
  }
  
  function PoEExchanges() {
    const { updated, exchanges } = priceData;
  
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Path of Exile Exchange Data
        </Typography>
        <Typography variant="body2" gutterBottom>
          Overall Updated: {updated}
        </Typography>
  
        {exchanges.map((exchange, index) => (
          <ExchangeCard key={index} exchange={exchange} />
        ))}
      </Container>
    );
  }
  
  export default PoEExchanges;
