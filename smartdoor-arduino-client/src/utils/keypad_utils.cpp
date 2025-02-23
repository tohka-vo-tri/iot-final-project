#include "utils/keypad_utils.h"
#include "events/event_producer.h"
#include <Keypad.h>
#include <Arduino.h>
#include <ArduinoJson.h>

char keys[4][4] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte colPins[4] = {5, 4, 3, 2};
byte rowPins[4] = {9, 8, 7, 6};

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, 4, 4);
String wrap_send_data (String data, String key);
String keyboardEnter = "";

void handle_keypad_input() {
  char key = keypad.getKey();
  if (key) {
    Serial.print("Key pressed: ");
    Serial.println(key);
    trigger_event(EventType::PASSWORD_INPUT, wrap_send_data(keyboardEnter,"password_input"));
    if (key == '#') {
      Serial.print("You entered: ");
      Serial.println(keyboardEnter);
      trigger_event(EventType::PASSWORD_LOGIN, wrap_send_data(keyboardEnter, "password"));
      keyboardEnter = "";
    } else if (key == '*') {
      keyboardEnter = "";
    } else {
      keyboardEnter += key;
    }
  }
}

String wrap_send_data (String data, String key) {
  JsonDocument doc;
  doc[key] = data;
  String jsonString;
  serializeJson(doc, jsonString);
  return jsonString;
}