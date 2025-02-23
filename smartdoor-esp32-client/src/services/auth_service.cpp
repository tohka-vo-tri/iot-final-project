#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>

const String API_URL = BASE_API_URL;
void handle_api_request(const String& method, const String& endpoint, const JsonDocument& payload) {
    Serial.println("Calling API for method: " + method);

    String url = String(API_URL + endpoint);

    JsonDocument requestDoc;
    requestDoc["method"] = method;
    requestDoc["data"] = payload;

    String jsonData;
    serializeJson(requestDoc, jsonData);

    String response = call_api(url, HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}

void handle_password_login(const String& payload) {
    Serial.println("Authenticating with password...");

    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for password login");
        return;
    }

    String password = jsonDoc["password"] | "";
    password.trim();

    if (password.length() > 0) {
        JsonDocument requestDoc;
        requestDoc["password"] = password;

        handle_api_request("password", "/login", requestDoc);
    } else {
        Serial.println("Password field is empty");
    }
}

void handle_fingerprint_login(const String& payload) {
    Serial.println("Authenticating with fingerprint...");

    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for fingerprint login");
        return;
    }

    handle_api_request("fingerprint", "/fingerprint/login", jsonDoc);
}
void handle_rfid_login(const String& payload) {
    Serial.println("Authenticating with RFID...");

    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for RFID login");
        return;
    }

    handle_api_request("rfid", "/rfid/login", jsonDoc);
}

void handle_fingerprint_signup(const String& payload) {
    Serial.println("Signing up with fingerprint...");

    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for fingerprint signup");
        return;
    }

    handle_api_request("fingerprint", "/fingerprint/signup", jsonDoc);
}

void handle_rfid_signup(const String& payload) {
    Serial.println("Signing up with RFID...");

    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for RFID signup");
        return;
    }

    handle_api_request("rfid", "/rfid/signup", jsonDoc);
}