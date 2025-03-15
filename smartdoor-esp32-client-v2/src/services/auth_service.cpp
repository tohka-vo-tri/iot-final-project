#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include "handlers/door_handler.h"
#include <utils/lcd_utils.h>

const String API_URL = BASE_API_URL;
const String IOT_DEVICE_ID = DEVICE_ID;

using APIEventCallback = std::function<void(bool)>;
using APIResponseProcessor = std::function<bool(const String&)>;

JsonDocument& getJsonDocument() {
    static JsonDocument jsonDoc;
    jsonDoc.clear();
    return jsonDoc;
}

String handle_api_request(const String& endpoint, const JsonDocument& payload, HttpMethod method = HttpMethod::POST) {
    Serial.println("Calling API for endpoint: " + endpoint);
    String url = API_URL + endpoint;
    String jsonData;
    serializeJson(payload, jsonData);
    String response = call_api(url, method, jsonData);
    Serial.println("API Response: " + response);
    return response;
}

bool default_api_response_processor(const String& responsePayload) {
    JsonDocument responseDoc;
    DeserializationError error = deserializeJson(responseDoc, responsePayload);
    if (error) {
        Serial.println("Failed to parse API response: " + String(error.c_str()));
        return false;
    }
    String message = responseDoc["message"] | "";
    message.trim();
    return (message == "Authentication successful" || message.indexOf("added successfully") != -1);
}

void handle_authentication(const String& method, const String& data, const String& endpoint, HttpMethod httpMethod, APIEventCallback callback, APIResponseProcessor responseProcessor = default_api_response_processor) {
    if (data.isEmpty()) {
        Serial.println(method + " field is empty");
        return;
    }

    Serial.println("Authenticating with " + method + "...");
    clear_display();
    print_to_lcd(0, "Please Wait...");
    
    JsonDocument& jsonDoc = getJsonDocument();
    jsonDoc["deviceId"] = IOT_DEVICE_ID;
    jsonDoc[method] = data;
    
    String response = handle_api_request(endpoint, jsonDoc, httpMethod);
    bool success = responseProcessor(response);
    if (callback) callback(success);
}

void handle_password_login(const String& password, APIEventCallback callback) {
    handle_authentication("password", password, "/auth/device", HttpMethod::POST, callback);
}

void handle_rfid_login(const String& rfid, APIEventCallback callback) {
    handle_authentication("rfid", rfid, "/auth/device", HttpMethod::POST, callback);
}

void handle_fingerprint_login(const String& fingerprint, APIEventCallback callback) {
    handle_authentication("fingerprint", fingerprint, "/auth/device", HttpMethod::POST, callback);
}

void handle_fingerprint_register(const String& fingerprint, APIEventCallback callback) {
    handle_authentication("fingerprint", fingerprint, "/devices/add-fingerprint", HttpMethod::PUT, callback);
}

void handle_rfid_register(const String& rfid, APIEventCallback callback) {
    handle_authentication("rfid", rfid, "/devices/add-rfid", HttpMethod::PUT, callback);
}
