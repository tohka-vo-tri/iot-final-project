#include <Arduino.h>
#include <ArduinoJson.h>
#include "services/display_service.h"
#include "utils/serial_utils.h"
#include "utils/lcd_utils.h"
void handle_password_input_display (const String& payloads) {
    
    JsonDocument doc;
    bool status = convert_payload_to_jsondoc(payloads, doc);
    if (status) {
        const String result = doc["password_input"];
        print_to_lcd(0, "Enter Password");
        print_to_lcd(1, result);
    } else {
        Serial.println("Skip");
    }
}

void handle_password_display(const String& payloads) {
    clear_display();
    print_to_lcd(0,"Enter Password");
}

void handle_rfid_display(const String& payloads) {
    clear_display();
    print_to_lcd(0, "Put your rfid");
}

void handle_fingerprint_display(const String& payloads) {
    clear_display();
    print_to_lcd(0, "Put your finger");
}

void handle_fingerprint_register_display(const String& payloads) {
    clear_display();
    print_to_lcd(0, "Register Mode");
    print_to_lcd(1, "Put your finger");
}

void handle_rfid_register_display(const String& payloads) {
    clear_display();
    print_to_lcd(0, "Register Mode");
    print_to_lcd(1, "Put your rfid");
}