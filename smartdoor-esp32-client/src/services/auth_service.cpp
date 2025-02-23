#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>

const String API_URL = BASE_API_URL;

void handle_password_login(const String& payload) {
    Serial.println("Authenticating with password...");
    int passwordIndex = payload.indexOf("PASSWORD:");
    if (passwordIndex != -1) {
        String password = payload.substring(passwordIndex + 9);
        password.trim();
        Serial.println("Accessing API for authentication...");
        String url = String(API_URL + "/login");
        JsonDocument jsonDoc;
        jsonDoc["method"] = "password";
        jsonDoc["password"] = password;

        String jsonData;
        serializeJson(jsonDoc, jsonData);
        String response = call_api(url,HttpMethod::POST, jsonData);
        Serial.println("API Response: " + response);
    } else {
        Serial.println("Invalid Login Command");
    }
}
void handle_fingerprint_login(const String& payload) {
    Serial.println("Authenticating with fingerprint...");
    String url = String(API_URL + "/fingerprint/login");
    JsonDocument jsonDoc;
    jsonDoc["method"] = "fingerprint";
    jsonDoc["data"] = payload;

    String jsonData;
    serializeJson(jsonDoc, jsonData);
    String response = call_api(url,HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}

void handle_rfid_login(const String& payload) {
    Serial.println("Authenticating with RFID...");
    String url = String(API_URL + "/rfid/login");
    JsonDocument jsonDoc;
    jsonDoc["method"] = "rfid";
    jsonDoc["data"] = payload;

    String jsonData;
    serializeJson(jsonDoc, jsonData);
    String response = call_api(url,HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}

void handle_fingerprint_signup(const String& payload) {
    Serial.println("Signing up with fingerprint...");
    String url = String(API_URL + "/fingerprint/signup");
    JsonDocument jsonDoc;
    jsonDoc["method"] = "fingerprint";
    jsonDoc["data"] = payload;

    String jsonData;
    serializeJson(jsonDoc, jsonData);
    String response = call_api(url,HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}

void handle_rfid_signup(const String& payload) {
    Serial.println("Signing up with RFID...");
    String url = String(API_URL + "/rfid/signup");
    JsonDocument jsonDoc;
    jsonDoc["method"] = "rfid";
    jsonDoc["data"] = payload;
    String jsonData;
    serializeJson(jsonDoc, jsonData);
    String response = call_api(url,HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}