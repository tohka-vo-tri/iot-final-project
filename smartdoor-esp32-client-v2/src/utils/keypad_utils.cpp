#include "utils/keypad_utils.h"
#include <Wire.h>
#include <Keypad_I2C.h>
#include <ArduinoJson.h>
#include "events/input_mode.h"
#include "utils/i2c_address_utils.h"

#define SDA_PIN 21
#define SCL_PIN 22
#define ROWS 4
#define COLS 4

char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte rowPins[ROWS] = {0, 1, 2, 3};
byte colPins[COLS] = {4, 5, 6, 7};

Keypad_I2C keypad = Keypad_I2C(makeKeymap(keys), rowPins, colPins, ROWS, COLS, 0x20);

String wrap_send_data(String data, String key);
String keyboardEnter = "";
bool isRegisterMode = false;
InputMode currentMode = InputMode::PASSWORD;

void setup_keypad_device() {
    Wire.begin(SDA_PIN, SCL_PIN);
    byte lcdAddress = scan_i2c_address();
  if (lcdAddress != 0) {
    Serial.print("Keypad Address Found");
    Serial.println(lcdAddress, HEX);
    keypad = Keypad_I2C(makeKeymap(keys), rowPins, colPins, ROWS, COLS, lcdAddress);
    keypad.begin();
  } else {
    Serial.println("Keypad not found!");
  }
}

void handle_keypad_input() {
    char key = keypad.getKey();
    if (key) {
        Serial.print("Key pressed: ");
        Serial.println(key);
        
        if (key == 'A') {
            isRegisterMode = false;
            currentMode = InputMode::PASSWORD;
            Serial.println("Switched to PASSWORD mode");
            // 
            keyboardEnter = "";
        } 
        else if (key == 'B') {
            isRegisterMode = false;
            currentMode = InputMode::FINGERPRINT;
            
            Serial.println("Switched to FINGERPRINT mode");
            keyboardEnter = "";
        } 
        else if (key == 'C') {
            isRegisterMode = false;
            currentMode = InputMode::RFID;
            
            keyboardEnter = "";
        } 
        else if (key == 'D') {
            Serial.print("You entered: ");
            Serial.println(keyboardEnter);
            switch (currentMode) {
                case InputMode::FINGERPRINT:
                    isRegisterMode = true;
                    
                    break;
                case InputMode::RFID:
                    isRegisterMode = true;
                    
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
                
            }
        } 
        else if (key == '#') {
            
        } 
        else {
            keyboardEnter += key;
            if (currentMode == InputMode::PASSWORD) {
                
            }
        }
    }
}

String wrap_send_data(String data, String key) {
    DynamicJsonDocument doc(256);
    doc[key] = data;
    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
}
