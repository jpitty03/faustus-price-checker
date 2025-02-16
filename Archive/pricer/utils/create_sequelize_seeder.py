import json
import psycopg2
from datetime import datetime
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv


def update_database():
    load_dotenv()

    DB_CONFIG = {
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USERNAME"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": "5432",
    }

    # Load JSON files
    with open("C:\\Users\\jpitt\\VSCode\\faustus-price-checker\\Archive\\web-ui\\public\\faustusPrices.json", "r") as f:
        prices_data = json.load(f)

    with open("C:\\Users\\jpitt\\VSCode\\faustus-price-checker\\Archive\\web-ui\\public\\currencyOverview.json", "r") as f:
        currency_data = json.load(f)

    # ✅ Fix: Build currency icon map from `lines`, supporting both `currencyTypeName` and `name`
    currency_icon_map = {
        line.get("currencyTypeName", line.get("name", "")): line.get("icon", "")  # Handle both `currencyTypeName` and `name`
        for line in currency_data.get("lines", []) if "icon" in line  # Ensure icon exists
    }

    # ✅ Fix: Build ninja price map, supporting both `chaosEquivalent` and `chaosValue`
    ninja_price_map = {
        line.get("currencyTypeName", line.get("name", "")): line.get("chaosEquivalent", line.get("chaosValue", 0))  
        for line in currency_data.get("lines", []) if "currencyTypeName" in line or "name" in line
    }

    # ✅ Debugging
    # print("🔍 currency_icon_map:", json.dumps(currency_icon_map, indent=2))

    # Get current timestamp for created_at & last_updated
    timestamp = datetime.utcnow().isoformat() + "Z"

    # Prepare bulk insert/update data
    bulk_data = []

    for exchange in prices_data.get("exchanges", []):  # Use .get() to avoid KeyError
        have_currency = exchange.get("haveCurrency")
        want_currency = exchange.get("wantCurrency")

        # 🔥 Debug: Check if we get the expected icons
        have_icon = currency_icon_map.get(have_currency, "MISSING")
        want_icon = currency_icon_map.get(want_currency, "MISSING")
        # print(f"🛠 Mapping: {have_currency} → {have_icon}, {want_currency} → {want_icon}")

        # Find the first offer
        if exchange.get("offers"):
            first_offer = exchange["offers"][0]
            bulk_data.append((
                timestamp, have_currency, first_offer["haveAmount"], want_currency, first_offer["wantAmount"],
                "offer", first_offer["stock"], ninja_price_map.get(want_currency, 0),
                exchange.get("lastUpdated", timestamp), have_icon, want_icon
            ))

        # Find the first competing trade
        if exchange.get("competingTrades"):
            first_competing = exchange["competingTrades"][0]
            bulk_data.append((
                timestamp, have_currency, first_competing["haveAmount"], want_currency, first_competing["wantAmount"],
                "competing", first_competing["stock"], ninja_price_map.get(want_currency, 0),
                exchange.get("lastUpdated", timestamp), have_icon, want_icon
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
