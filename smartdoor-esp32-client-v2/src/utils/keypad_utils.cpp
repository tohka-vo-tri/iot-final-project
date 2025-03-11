#include "utils/keypad_utils.h"
#include <Wire.h>
#include <Keypad_I2C.h>
#include <ArduinoJson.h>
#include "events/input_mode.h"

#define MCP23017_ADDR 0x20
#define SDA_PIN 21
#define SCL_PIN 22
#define ROWS 4
#define COLS 4

// Define keypad layout
char keys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

// Define row and column pins (MCP23017 pin mapping)
byte rowPins[ROWS] = {0, 1, 2, 3};  // Adjust these based on your wiring
byte colPins[COLS] = {4, 5, 6, 7};  // Adjust these based on your wiring

// ✅ Corrected Keypad_I2C constructor (removed `&Wire`)
Keypad_I2C keypad = Keypad_I2C(makeKeymap(keys), rowPins, colPins, ROWS, COLS, MCP23017_ADDR);

String wrap_send_data(String data, String key);
String keyboardEnter = "";
bool isRegisterMode = false;
InputMode currentMode = InputMode::PASSWORD; // Default mode

void setup() {
    Wire.begin(SDA_PIN, SCL_PIN); // Start I2C on ESP32
    Serial.begin(115200);
    keypad.begin();
}

void loop() {
    handle_keypad_input();
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
