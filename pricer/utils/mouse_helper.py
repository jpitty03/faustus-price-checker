import random
import pyautogui


def get_random_mouse_position(coords):
    x1, y1, x2, y2 = coords
    return (random.randint(x1, x2), random.randint(y1, y2))

def move_mouse_to_position(coords):
    x, y = get_random_mouse_position(coords)
    pyautogui.moveTo(
        x=x, 
        y=y, 
        duration=.4,  # Duration in seconds
        tween=pyautogui.easeInOutQuad  # Tweening function for smooth movement
    )

def click_mouse():
    pyautogui.sleep(.2)
    pyautogui.mouseDown()
    pyautogui.sleep(.05)
    pyautogui.mouseUp()

def exchange_search(currency, coords):
    pyautogui.sleep(.2)
    pyautogui.keyDown('ctrl')
    pyautogui.keyDown('f')
    pyautogui.keyUp('f')
    pyautogui.keyUp('ctrl')
    pyautogui.write('^' + currency + '$')
    pyautogui.sleep(.1)
    move_mouse_to_position(coords)  # Move mouse to select currency
    click_mouse()  # Click mouse



# pyautogui.sleep(2)
# move_mouse_to_position(resolution[2])  # Move mouse to random position on
# click_mouse()  # Click mouse
# exchange_search('Chaos Orb', resolution[5])  # Search for currency exchange

# move_mouse_to_position(resolution[3])  # Move mouse to random position on
# click_mouse()  # Click mouse
# exchange_search('Divine Orb', resolution[5])  # Search for currency exchange
