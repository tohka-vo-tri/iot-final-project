#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include "handlers/door_handler.h"
#include <utils/lcd_utils.h>

const String API_URL = BASE_API_URL;
const String IOT_DEVICE_ID = DEVICE_ID;
void handle_api_request(const String& endpoint, const JsonDocument& payload) {
    Serial.println("Calling API for endpoint: " + endpoint);

    String url = API_URL + endpoint;

    String jsonData;
    serializeJson(payload, jsonData);

    String response = call_api(url, HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
}

void build_auth_payload(JsonDocument& payload, const String& method, const String& data) {
    payload["deviceId"] = IOT_DEVICE_ID;
    if (method == "password") {
        payload["password"] = data;
    } else if (method == "rfid") {
        payload["rfid"] = data;
    } else if (method == "fingerprint") {
        payload["fingerprint"] = data;
    }
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
        build_auth_payload(requestDoc, "password", password);
        handle_api_request("/auth/device", requestDoc);
    }}

void handle_rfid_login(const String& payload) {
    Serial.println("Authenticating with RFID...");
    JsonDocument jsonDoc;
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for RFID login");
        return;
    }

    String rfid = jsonDoc["rfid"] | "";
    rfid.trim();

    if (rfid.length() > 0) {
        JsonDocument requestDoc;
        build_auth_payload(requestDoc, "rfid", rfid);
        handle_api_request("/login", requestDoc);
    } else {
        Serial.println("RFID field is empty");
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

    String fingerprint = jsonDoc["fingerprint"] | "";
    fingerprint.trim();

    if (fingerprint.length() > 0) {
        DynamicJsonDocument requestDoc(256);
        build_auth_payload(requestDoc, "fingerprint", fingerprint);
        handle_api_request("/login", requestDoc);
    } else {
        Serial.println("Fingerprint field is empty");
    }
}