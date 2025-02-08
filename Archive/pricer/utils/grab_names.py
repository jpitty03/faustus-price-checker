import os
import json

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

array = [
    'Horned Scarab of Preservation', 
    'Ambush Scarab of Containment', 
    'Horned Scarab of Glittering', 
    'Horned Scarab of Awakening', 
    'Horned Scarab of Bloodlines', 
    'Ultimatum Scarab of Catalysing', 
    'Horned Scarab of Pandemonium', 
    'Harvest Scarab of Cornucopia', 
    'Essence Scarab of Calcification', 
    'Domination Scarab of Terrors', 
    'Incursion Scarab of Timelines', 
    'Harvest Scarab of Doubling', 
    'Ambush Scarab of Discernment', 
    'Harbinger Scarab of Regency', 
    'Cartography Scarab of Corruption', 
    'Blight Scarab of Blooming', 
    'Ultimatum Scarab of Dueling', 
    'Scarab of Wisps', 
    'Harbinger Scarab of Warhoards', 
    'Legion Scarab of Eternal Conflict', 
    'Essence Scarab of Adaptation', 
    'Breach Scarab of Resonant Cascade', 
    'Divination Scarab of Pilfering', 
    'Cartography Scarab of the Multitude', 
    'Breach Scarab of Snares', 
    'Ambush Scarab', 
    'Horned Scarab of Nemeses', 
    'Ritual Scarab of Abundance', 
    'Titanic Scarab of Legend', 
    'Delirium Scarab of Paranoia', 
    'Divination Scarab of The Cloister', 
    'Cartography Scarab of Risk', 
    'Harbinger Scarab', 
    'Bestiary Scarab of the Herd', 
    'Bestiary Scarab of Duplicating', 
    'Anarchy Scarab of Gigantification', 
    'Horned Scarab of Tradition', 
    'Scarab of Radiant Storms', 
    'Blight Scarab of Invigoration', 
    'Abyss Scarab of Profound Depth', 
    'Titanic Scarab of Treasures', 
    'Scarab of Monstrous Lineage', 
    'Influencing Scarab of Conversion', 
    'Breach Scarab', 
    'Ultimatum Scarab of Bribing', 
    'Influencing Scarab of Hordes', 
    'Essence Scarab of Ascent', 
    'Domination Scarab of Evolution'
    ]