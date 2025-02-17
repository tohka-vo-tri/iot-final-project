#include "keypad_utils.h"
#include <Keypad.h>
#include <Arduino.h>
String keyboardEnter = "";

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte rowPins[4] = {2, 3, 4, 5};
byte colPins[4] = {6, 7, 8, 9};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, 4, 4);

void handle_keypad_input() {
  char key = keypad.getKey();
  if (key) {
    Serial.print("Key pressed: ");
    Serial.println(key);
    if (key == '#') {
      Serial.print("You entered: ");
      Serial.println(keyboardEnter);
      keyboardEnter = "";
    } else if (key == '*') {
      keyboardEnter = "";
    } else {
      keyboardEnter += key;
    }
  }
}
