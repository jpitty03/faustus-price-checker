import json
import psycopg2
from datetime import datetime
from psycopg2.extras import execute_values

# Database connection details
DB_CONFIG = {
    "dbname": "CHANGEME",
    "user": "CHANGEME",
    "password": "CHANGEME",
    "host": "CHANGEME",
    "port": "5432",
}

# Load JSON files
with open("C:\\Users\\jpitt\\VSCode\\faustus-price-checker\\Archive\\web-ui\\public\\faustusPrices.json", "r") as f:
    prices_data = json.load(f)

with open("C:\\Users\\jpitt\\VSCode\\faustus-price-checker\\Archive\\web-ui\\public\\currencyOverview.json", "r") as f:
    currency_data = json.load(f)

# ✅ Fix: Build currency icon map from `lines` instead of `currencyDetails`
currency_icon_map = {
    line["currencyTypeName"]: line.get("icon", "")  # Safely get icon or default to empty string
    for line in currency_data.get("lines", []) if "currencyTypeName" in line
}

# ✅ Fix: Build ninja price map from `lines`
ninja_price_map = {
    line["currencyTypeName"]: line.get("chaosEquivalent", 0)  # Default to 0 if missing
    for line in currency_data.get("lines", []) if "currencyTypeName" in line
}

# Get current timestamp for created_at & last_updated
timestamp = datetime.utcnow().isoformat() + "Z"

# Prepare bulk insert/update data
bulk_data = []

for exchange in prices_data.get("exchanges", []):  # Use .get() to avoid KeyError
    have_currency = exchange.get("haveCurrency")
    want_currency = exchange.get("wantCurrency")

    # Find the first offer
    if exchange.get("offers"):
        first_offer = exchange["offers"][0]
        bulk_data.append((
            timestamp, have_currency, first_offer["haveAmount"], want_currency, first_offer["wantAmount"],
            "offer", first_offer["stock"], ninja_price_map.get(want_currency, 0),
            exchange.get("lastUpdated", timestamp), currency_icon_map.get(have_currency, ""),
            currency_icon_map.get(want_currency, "")
        ))

    # Find the first competing trade
    if exchange.get("competingTrades"):
        first_competing = exchange["competingTrades"][0]
        bulk_data.append((
            timestamp, have_currency, first_competing["haveAmount"], want_currency, first_competing["wantAmount"],
            "competing", first_competing["stock"], ninja_price_map.get(want_currency, 0),
            exchange.get("lastUpdated", timestamp), currency_icon_map.get(have_currency, ""),
            currency_icon_map.get(want_currency, "")
        ))

# ✅ PostgreSQL: Upsert query with ON CONFLICT
try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    upsert_query = """
    INSERT INTO prices (
        created_at, have_currency, have_amount, want_currency, want_amount, trade_type, 
        stock, ninja_price, last_updated, have_currency_icon, want_currency_icon
    ) VALUES %s
    ON CONFLICT ON CONSTRAINT unique_trade 
    DO UPDATE SET 
        have_amount = EXCLUDED.have_amount,
        want_amount = EXCLUDED.want_amount,
        stock = EXCLUDED.stock,
        ninja_price = EXCLUDED.ninja_price,
        last_updated = EXCLUDED.last_updated,
        have_currency_icon = EXCLUDED.have_currency_icon,
        want_currency_icon = EXCLUDED.want_currency_icon;
    """

    # ✅ Fix: Execute the upsert query only if bulk_data is not empty
    if bulk_data:
        execute_values(cur, upsert_query, bulk_data)
        conn.commit()
        print("✅ Database updated successfully!")
    else:
        print("⚠️ No valid data found to update.")

except Exception as e:
    print("❌ Database update failed:", e)
finally:
    if conn:
        cur.close()
        conn.close()