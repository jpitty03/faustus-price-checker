import os
import json

'''
Helper function to extract names into a printable array.
Supply data,json with poe.ninja API json.
Replace "Name" if needed
'''

# Get the absolute path of this script file.
script_dir = os.path.dirname(os.path.realpath(__file__))

# Build the full path to the data.json file in the same folder.
data_path = os.path.join(script_dir, "data.json")

with open(data_path, "r", encoding="utf-8") as f:
    data = json.load(f)

filtered_names = [
    entry["name"]
    for entry in data["lines"]
    if entry["chaosValue"] >= 2
]

print(filtered_names)