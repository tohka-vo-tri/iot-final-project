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