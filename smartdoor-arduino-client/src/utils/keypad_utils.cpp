#include "utils/keypad_utils.h"
#include "events/event_producer.h"
#include <Keypad.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include "events/input_mode.h"

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
      if (key == 'A') {
          currentMode = InputMode::PASSWORD;
          Serial.println("Switched to PASSWORD mode");
          keyboardEnter = "";
      } 
      else if (key == 'B') {
          currentMode = InputMode::FINGERPRINT;
          Serial.println("Switched to FINGERPRINT mode");
          keyboardEnter = "";
      } 
      else if (key == 'C') {
          currentMode = InputMode::RFID;
          Serial.println("Switched to RFID mode");
          keyboardEnter = "";
      } 
      else if (key == 'D') {
          Serial.print("You entered: ");
          Serial.println(keyboardEnter);
          switch (currentMode) {
              case InputMode::PASSWORD:
                  trigger_event(EventType::PASSWORD_MODE_DISPLAY, wrap_send_data(keyboardEnter, "password"));
                  break;
              case InputMode::FINGERPRINT:
                  trigger_event(EventType::FINGERPRINT_MODE_DISPLAY, wrap_send_data(keyboardEnter, "fingerprint"));
                  break;
              case InputMode::RFID:
                  trigger_event(EventType::RFID_MODE_DISPLAY, wrap_send_data(keyboardEnter, "rfid"));
                  break;
              default:
                  Serial.println("No valid mode selected!");
                  break;
          }

          keyboardEnter = "";
      } 
      else if (key == '*') {
          Serial.println("Input cleared.");
          keyboardEnter = "";
          if (currentMode == InputMode::PASSWORD) {
            trigger_event(EventType::PASSWORD_INPUT, wrap_send_data(keyboardEnter, "password_input"));
          }
      }else if (key == '#') {
        trigger_event(EventType::PASSWORD_LOGIN, wrap_send_data(keyboardEnter, "password"));
        keyboardEnter = "";
        currentMode = InputMode::NONE;
      } 
      else {
          keyboardEnter += key;
          if (currentMode == InputMode::PASSWORD) {
            trigger_event(EventType::PASSWORD_INPUT, wrap_send_data(keyboardEnter, "password_input"));
        }
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