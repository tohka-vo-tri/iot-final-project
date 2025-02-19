#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>

const String correctPassword = "1234";

void handle_password_login(const String& payload) {
    Serial.println("Authenticating...");
    int passwordIndex = payload.indexOf("PASSWORD:");
    
    if (passwordIndex != -1) {
        String password = payload.substring(passwordIndex + 9);
        password.trim();

        if (password == correctPassword) {
            Serial.println("Access Granted!");
        } else {
            Serial.println("Access Denied!");
        }
    } else {
        Serial.println("Invalid Login Command");
    }
}

void handle_fingerprint_login(const String& payload) {

}
void handle_rfid_login(const String& payload) {

}
void handle_fingerprint_signup(const String& payload) {

}
void handle_rfid_signup(const String& payload) {

}
