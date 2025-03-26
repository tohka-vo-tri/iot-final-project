#include <Arduino.h>
#include "handlers/keyboard_handler.h"
#include "handlers/door_handler.h"
#include "utils/keypad_utils.h"
#include "utils/lcd_utils.h"
#include "services/auth_service.h"
#include "events/input_mode.h"
#include "ArduinoJson.h"
#include "utils/led_utils.h"
String keyboardEnter = "";
void register_print_mode (InputMode& mode);
void handle_keypad_input() {
    char key = get_key();
    if (key) {
        Serial.print("Key pressed: ");
        Serial.println(key);

        if (key == 'A') {
            isRegisterMode = false;
            currentMode = InputMode::PASSWORD;
            Serial.println("Switched to PASSWORD mode");
            clear_display();
            print_to_lcd(0, "Enter Password");
            keyboardEnter = "";
        } else if (key == 'B') {
            isRegisterMode = false;
            currentMode = InputMode::FINGERPRINT;
            Serial.println("Switched to FINGERPRINT mode");
            clear_display();
            print_to_lcd(0, "Put Finger");
            keyboardEnter = "";
        } else if (key == 'C') {
            isRegisterMode = false;
            currentMode = InputMode::RFID;
            Serial.println("Switched to RFID mode");
            clear_display();
            print_to_lcd(0, "Enter RFID");
            keyboardEnter = "";
        } else if (key == 'D') {
            Serial.print("You entered: ");
            Serial.println(keyboardEnter);
            switch (currentMode) {
                case InputMode::FINGERPRINT:
                case InputMode::RFID:
                    isRegisterMode = true;
                    register_print_mode(currentMode);
                    break;
                default:
                    Serial.println("No valid mode selected!");
                    break;
            }
            keyboardEnter = "";
        } else if (key == '*') {
            Serial.println("Input cleared.");
            keyboardEnter = "";
        } else if (key == '#') {
            if (currentMode == InputMode::PASSWORD) {
                Serial.print("Authenticating with password: ");
                Serial.println(keyboardEnter);

                handle_password_login(keyboardEnter, [](bool success) {
                    if (success) {
                        clear_display();
                        digitalWrite(LED_GREEN, HIGH);  // Bật LED xanh khi thành công
                        digitalWrite(LED_RED, LOW);
                        print_to_lcd(0, "Login Success");
                        print_to_lcd(1, "Door Opened");
                        spin_servo_on_success();
                        delay(5000);
                        clear_display();
                        digitalWrite(LED_GREEN, LOW);  // Tắt LED xanh sau khi mở cửa
                        print_to_lcd(0, "Welcome, User");
                        print_to_lcd(1, "Please Choice");

                    } else {
                        clear_display();
                        digitalWrite(LED_RED, HIGH);  // Bật LED đỏ khi thất bại
                        digitalWrite(LED_GREEN, LOW);
                        print_to_lcd(0, "Login Failed");
                        print_to_lcd(1, "Door Lock");
                        delay(2000);
                        digitalWrite(LED_RED, LOW);  // Tắt LED đỏ sau khi thất bại
                        clear_display();
                        print_to_lcd(0, "Enter Password");
                    }
                });
                keyboardEnter = "";
            }
        } 
        else {
            keyboardEnter += key;
            if (currentMode == InputMode::PASSWORD) {
                print_to_lcd(1,keyboardEnter);
            }
        }
    }
}

void register_print_mode (InputMode& mode) {
    clear_display();
    print_to_lcd(0, "Register Mode");
    switch (mode)
    {
    case InputMode::FINGERPRINT:
        print_to_lcd(1, "Put Finger");
        break;
    case InputMode::RFID:
        print_to_lcd(1, "Enter RFID");
        break;
    default:
        break;
    }
}