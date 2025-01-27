import requests
import json
import os
import sys

def getNinjaInfo():
    url = "https://poe.ninja/api/data/currencyoverview?league=Settlers&type=Currency"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        sys.exit(1)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    save_dir = os.path.abspath(os.path.join(script_dir, '../../web-ui/public'))
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, 'currencyOverview.json')

    try:
        with open(save_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print(f"Data saved to {save_path}")
    except IOError as e:
        print(f"Error saving data: {e}")
        sys.exit(1)

getNinjaInfo()
