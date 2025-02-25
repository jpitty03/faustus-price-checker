import json
import datetime
import re
import os
from time import sleep

import pyautogui
from utils.create_sequelize_seeder import update_database
from utils.ninjaApi import get_ninja_info, merge_json_files, update_json_file
from utils.mouse_helper import click_mouse, exchange_search, move_mouse_to_position, move_mouse_to_random
from utils.currencies import have_currencies, want_currencies
from utils.resolution_helper import resolution_2560 as resolution

from PIL import ImageGrab, ImageOps, ImageEnhance, Image
import pytesseract

# If Tesseract isn't on your PATH, uncomment and set it to the correct location:
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

###############################################################################
# 1. SCREEN CAPTURE AND OCR
###############################################################################

def capture_and_process_trade_window(
    region=None, 
    invert_colors=True,
    threshold=True,
    enhance_contrast=True,
    contrast_factor=1.5,
    upscale_factor=3.0
):
    save_debug=False
    debug_dir="screenshots"

    # Move Cursor to Top Middle where Market Ratio is displayed
    move_mouse_to_position(resolution[4])

    # 1. Capture screenshot
    pyautogui.keyDown('alt')
    screenshot = ImageGrab.grab(bbox=region) if region else ImageGrab.grab()
    pyautogui.keyUp('alt')

    if save_debug:
        os.makedirs(debug_dir, exist_ok=True)
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        original_path = os.path.join(debug_dir, f"original_{ts}.png")
        screenshot.save(original_path)

    # 2. Convert to grayscale
    processed = screenshot.convert("L")

    # 3. (Optional) Invert
    if invert_colors:
        processed = ImageOps.invert(processed)

    # 4. Upscale first
    if upscale_factor != 1.0:
        w, h = processed.size
        new_w = int(w * upscale_factor)
        new_h = int(h * upscale_factor)
        processed = processed.resize((new_w, new_h), Image.LANCZOS)

    # 5. (Optional) Enhance contrast
    if enhance_contrast:
        processed = processed.convert("L")  # ensure 8-bit
        enhancer = ImageEnhance.Contrast(processed)
        processed = enhancer.enhance(contrast_factor)

    # 6. (Optional) Threshold
    if threshold:
        processed = processed.point(lambda x: 255 if x > 105 else 0, '1')

    # 7. Save debug
    if save_debug:
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        processed_path = os.path.join(debug_dir, f"processed_{ts}.png")
        processed.save(processed_path)

    return processed


def capture_and_process_no_trades(region=None, upscale_factor=3.0):
    save_debug=False
    debug_dir="screenshots"

    # 1. Capture screenshot
    screenshot = ImageGrab.grab(bbox=region) if region else ImageGrab.grab()

    if save_debug:
        os.makedirs(debug_dir, exist_ok=True)
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        original_path = os.path.join(debug_dir, f"original_{ts}.png")
        screenshot.save(original_path)

    # 2. Convert to grayscale
    processed = screenshot.convert("L")

    # 3. (Optional) Invert
    processed = ImageOps.invert(processed)

    if upscale_factor != 1.0:
        w, h = processed.size
        new_w = int(w * upscale_factor)
        new_h = int(h * upscale_factor)
        processed = processed.resize((new_w, new_h), Image.LANCZOS)

    # 6. (Optional) Threshold
    processed = processed.point(lambda x: 255 if x > 105 else 0, '1')

    # 7. Save debug
    if save_debug:
        ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        processed_path = os.path.join(debug_dir, f"processed_{ts}.png")
        processed.save(processed_path)

    return processed

###############################################################################
# 2. PARSING LOGIC
###############################################################################

def parse_ocr_block(lines):
    """
    Takes lines like:
      [
        "4:1 1,488",
        "3:1 4,710",
        "«2.67 : 1 11,947"
      ]
    Returns a list of dicts (each with haveAmount, wantAmount, stock).
    """
    results = []
    for line in lines:
        entry = parse_line(line)
        if entry:
            results.append(entry)
        # else: skip or log that parse failed
    return results


def parse_line(line):
    """
    Example lines:
      "4:1 1,488"
      "2.67 :1 11,947"
      "«100 : 1 6"
    Strips weird leading characters and uses regex to extract:
      left float, right float, and stock int
    """
    # 1) Strip leading/trailing whitespace & weird chars (like '«')
    line = line.strip().lstrip("«<>\"")

    # 2) Regex to capture three groups:
    #    - float or int (left side)
    #    - float or int (right side)
    #    - stock (digits + optional commas)
    #
    # e.g. "2.67 : 1 11,947"
    #      left_str="2.67", right_str="1", stock_str="11,947"
    pattern = r"([0-9]*\.?[0-9]+)\s*:\s*([0-9]*\.?[0-9]+)\s+([\d,]+)"
    match = re.search(pattern, line)
    if not match:
        return None

    left_str, right_str, stock_str = match.groups()

    # Convert left & right to float
    left_val = float(left_str)
    right_val = float(right_str)

    # Remove commas from stock, then convert to int
    stock_val = int(stock_str.replace(",", ""))

    return {
        "haveAmount": right_val,
        "wantAmount": left_val,
        "stock": stock_val
    }

def parse_ratio_line(line):
    """
    Expects a line like 'Ratio: 1 : 180' (meaning 1 Divine = 180 Chaos).
    Returns (haveAmount, wantAmount) as integers in the original order.
    """
    # Remove 'Ratio:' if present
    cleaned = line.replace('Ratio', '').replace(':', ' ').strip()
    # You might have something like '1  180' if the text is '1 : 180'
    parts = re.split(r'\s+', cleaned)
    if len(parts) >= 2:
        try:
            left = int(parts[0])
            right = int(parts[1])
            return (left, right)
        except ValueError:
            return (None, None)
    return (None, None)

def parse_stock_line(line):
    """
    Expects a line like 'Stock: 18'. Returns the integer 18.
    If stock not found, returns None.
    """
    match = re.search(r'Stock:\s*(\d+)', line, re.IGNORECASE)
    if match:
        return int(match.group(1))
    return None

###############################################################################
# 3. UPDATING OUR JSON DATA
###############################################################################

def load_data(json_path):
    """
    Load existing JSON data or return a default structure if file doesn't exist.
    """
    if not os.path.exists(json_path):
        return {
            "updated": None,
            "exchanges": []
        }
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(json_path, data):
    """
    Save data to JSON with indentation.
    """
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def update_exchange(data, have_currency, want_currency, new_offers, new_competing):
    """
    data: the entire JSON object (with keys: "updated", "exchanges")
    have_currency, want_currency: strings, e.g. "Chaos Orb", "Divine Orb"
    new_offers, new_competing: parsed lists from parse_ocr_block()

    1. Sets the top-level "updated" to now.
    2. Finds or creates an exchange entry for (have_currency, want_currency).
    3. Replaces "offers" with new_offers, "competingTrades" with new_competing.
    4. Sets the exchange's "lastUpdated" to now.
    """

    now_iso = datetime.datetime.utcnow().isoformat() + "Z"
    data["updated"] = now_iso  # top-level timestamp

    # Find existing exchange
    exchange = None
    for ex in data["exchanges"]:
        if ex["haveCurrency"] == have_currency and ex["wantCurrency"] == want_currency:
            exchange = ex
            break

    # If not found, create a new one
    if exchange is None:
        exchange = {
            "haveCurrency": have_currency,
            "wantCurrency": want_currency,
            "lastUpdated": now_iso,
            "offers": [],
            "competingTrades": []
        }
        data["exchanges"].append(exchange)

    # Update this exchange
    exchange["lastUpdated"] = now_iso
    exchange["offers"] = new_offers
    exchange["competingTrades"] = new_competing

###############################################################################
# 4. EXCHANGE LOGIC
###############################################################################

def get_want(have_currency, want_currency):
    # Have exchange interface opened
    print(f"Getting offers for {have_currency} -> {want_currency}")

    # Move Cursor to Want Currency
    # Click on Want Currency
    move_mouse_to_position(resolution[3])
    click_mouse()

    # Ctrl + F
    # Paste Want Currency
    # Move Cursor to Top Middle where Currency is displayed
    # Click on Currency
    exchange_search(want_currency, resolution[5])
    click_mouse()

def get_have(have_currency):
    # Have exchange interface opened
    print(f"Getting offers for {have_currency}")

    # Move Cursor to random Have location within these coordinates (1473, 298, 1748, 343)
    # Click on Have Currency
    move_mouse_to_position(resolution[2])
    click_mouse()

    # Ctrl + F
    # Paste Have Currency
    # Move Cursor to Top Middle where Currency is displayed
    # Click on Currency
    exchange_search(have_currency, resolution[5])
    click_mouse()


def is_no_trades():
    move_mouse_to_random()
    move_mouse_to_position(resolution[4])
    pyautogui.keyDown('alt')
    no_trades_img = capture_and_process_no_trades(resolution[6])

    custom_config = "--psm 6"
    no_trades_text = pytesseract.image_to_string(no_trades_img, config=custom_config).splitlines()

    pyautogui.keyUp('alt')

    if not no_trades_text:  
        return False

    if len(no_trades_text) > 0 and "There are no" in no_trades_text[0]:
        return True
    return False


###############################################################################
# 5. MAIN SCRIPT LOGIC
###############################################################################

def main():
    sleep(3)  # Give you time to switch to the right screen
    json_path = "./Archive/web-ui/public/faustusPrices.json"
    data = load_data(json_path)

    # 3. Update the "Chaos Orb" -> "Divine Orb" exchange
    for have in have_currencies:
        get_have(have)
        for want in want_currencies:
            if want == have:
                continue
            get_want(have, want) # This sets up the exchange interface for Have/Want
            if is_no_trades():
                print(f"No trades available for {have} -> {want}")
                continue
            # perform screenshot and ocr
            main_trades_img = capture_and_process_trade_window(region=resolution[0])
            competing_trades_img = capture_and_process_trade_window(region=resolution[1])
            custom_config = "--psm 6"
            main_text = pytesseract.image_to_string(main_trades_img, config=custom_config)
            main_text = main_text.splitlines()
            competing_text = pytesseract.image_to_string(competing_trades_img, config=custom_config)
            competing_text = competing_text.splitlines()

            # print("\n=== MAIN TRADES OCR ===")
            # print(main_text)
            # print("\n=== MAIN TRADES PARSED OCR ===")
            # print(parse_ocr_block(main_text))
            main_trades = parse_ocr_block(main_text)
            print(main_trades)

            # print("\n=== COMPETING TRADES OCR ===")
            # print(competing_text)
            # print("\n=== COMPETING TRADES PARSED OCR ===")
            # print(parse_ocr_block(competing_text))
            competing_trades = parse_ocr_block(competing_text)
            print(competing_trades)

            # update exchange prices
            print(f"Updating exchange for {have} -> {want}")
            update_exchange(data, have, want, main_trades, competing_trades)

    # 4. Save the updated data
    save_data(json_path, data)

    print(f"Updated data in {json_path}")

if __name__ == "__main__":
    main()

pyautogui.sleep(.5)
print('Grabbing Ninja Prices')
get_ninja_info()
merge_json_files()
update_json_file()

pyautogui.sleep(.5)
print('Updating database...')
update_database()
