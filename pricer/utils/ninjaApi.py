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
                for key in ['paySparkLine', 'receiveSparkLine', 'lowConfidencePaySparkLine', 'lowConfidenceReceiveSparkLine']:
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



merge_json_files()


def getNinjaInfo():
    x = 0
    api_urls = [
    "https://poe.ninja/api/data/currencyoverview?league=Settlers&type=Fragment",
    "https://poe.ninja/api/data/currencyoverview?league=Settlers&type=Currency",
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

# getNinjaInfo()