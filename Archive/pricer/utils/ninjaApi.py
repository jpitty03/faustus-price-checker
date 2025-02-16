import datetime
import requests
import json
import os
import sys

def merge_json_files():
    # Specify the directory containing the JSON files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir =  os.path.abspath(os.path.join(script_dir, '../../web-ui/public/ninjaApi'))
    output_dir =  os.path.abspath(os.path.join(script_dir, '../../web-ui/public'))

    # Specify the output file path
    output_file = os.path.join(output_dir, 'currencyOverview.json')

    merged_lines = []
    merged_currency_details = []
    seen_currency_ids = set()

    for filename in os.listdir(input_dir):
        if filename.endswith('.json'):
            file_path = os.path.join(input_dir, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from {file_path}: {e}")
                continue
            except IOError as e:
                print(f"Error reading file {file_path}: {e}")
                continue

            # Process lines
            for line in data.get('lines', []):
                for key in ['pay', 'receive', 'paySparkLine', 'receiveSparkLine', 'lowConfidencePaySparkLine', 'lowConfidenceReceiveSparkLine', 'sparkline', 'itemClass', 'stackSize', 'lowConfidenceSparkline', 'implicitModifiers',
                            'explicitModifiers', 'flavourText', 'count', 'tradeInfo', 'listingCount', 'id', 'baseType']:
                    line.pop(key, None)
                merged_lines.append(line)

            # Process currencyDetails
            for detail in data.get('currencyDetails', []):
                currency_id = detail.get('id')
                if currency_id and currency_id not in seen_currency_ids:
                    merged_currency_details.append(detail)
                    seen_currency_ids.add(currency_id)

    date = None
    # create a variable for today's date, include hours, minutes, and seconds
    date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    merged_data = {
        "created": date,
        "lines": merged_lines,
        "currencyDetails": merged_currency_details
    }

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, indent=4)
        print(f"Merged JSON saved to {output_file}")
    except IOError as e:
        print(f"Error writing to file {output_file}: {e}")
        sys.exit(1)

def get_ninja_info():
    x = 0
    api_urls = [
    "https://poe.ninja/api/data/currencyoverview?league=Settlers&type=Fragment",
    "https://poe.ninja/api/data/currencyoverview?league=Settlers&type=Currency",
    "https://poe.ninja/api/data/itemoverview?league=Settlers&type=Scarab"
    ]

    for url in api_urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            sys.exit(1)

        script_dir = os.path.dirname(os.path.abspath(__file__))
        save_dir = os.path.abspath(os.path.join(script_dir, '../../web-ui/public/ninjaApi'))
        os.makedirs(save_dir, exist_ok=True)
        save_path = os.path.join(save_dir, 'currencyOverview' + str(x) + '.json')

        try:
            with open(save_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            print(f"Data saved to {save_path}")
        except IOError as e:
            print(f"Error saving data: {e}")
            sys.exit(1)
        x += 1


def update_json_file():
    # Define the input and output file paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(script_dir, "../../web-ui/public/currencyOverview.json")  # Adjust path if needed

    # Read the existing JSON file
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ Error reading JSON file: {e}")
        return

    # Create a mapping of currency names to icons from currencyDetails
    currency_icon_map = {c.get("name", ""): c.get("icon", "") for c in data.get("currencyDetails", [])}

    # Update `lines` with the corresponding `icon`
    for line in data.get("lines", []):
        currency_name = line.get("currencyTypeName")  # Ensure key exists
        if currency_name:
            line["icon"] = currency_icon_map.get(currency_name, "")

    # ✅ Fix: Handle missing "currencyTypeName" safely
    existing_currency_names = {line.get("currencyTypeName", "") for line in data.get("lines", []) if "currencyTypeName" in line}

    # ✅ Ensure "Chaos Orb" is present in `lines`
    chaos_orb_entry = {
        "currencyTypeName": "Chaos Orb",
        "chaosEquivalent": 1,
        "detailsId": "chaos-orb",
        "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvQ3VycmVuY3lSZXJvbGxSYXJlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d119a0d734/CurrencyRerollRare.png"
    }

    if "Chaos Orb" not in existing_currency_names:
        data["lines"].append(chaos_orb_entry)
        print("✅ Added Chaos Orb to lines.")

    # Remove `currencyDetails` from the final JSON
    updated_data = {
        "created": data.get("created", ""),
        "lines": data.get("lines", [])
    }

    # Overwrite the JSON file with the updated data
    try:
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(updated_data, f, indent=4)
        print(f"✅ Successfully updated {json_file_path}")
    except IOError as e:
        print(f"❌ Error writing to JSON file: {e}")
