#include "utils/keypad_utils.h"

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte colPins[4] = {26, 25, 33, 32};
byte rowPins[4] = {13, 12, 14, 27};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, 4, 4);

char get_key() {
    return keypad.getKey();
}
