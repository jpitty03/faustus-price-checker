function ExchangeCard({ exchange }) {
    const {
      haveCurrency,
      wantCurrency,
      lastUpdated,
      offers,
      competingTrades,
    } = exchange;
  
    return (
      <div style={{ border: "1px solid #ccc", margin: "1rem", padding: "1rem" }}>
        <h3>
          {haveCurrency} → {wantCurrency}
        </h3>
        <p>Last Updated: {lastUpdated}</p>
  
        <h4>Offers</h4>
        <OffersTable offers={offers} />
  
        <h4>Competing Trades</h4>
        <OffersTable offers={competingTrades} />
      </div>
    );
  }
  