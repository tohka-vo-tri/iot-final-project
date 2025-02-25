#include "services/auth_service.h"
#include "utils/api_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include "handlers/door_handler.h"
#include <utils/lcd_utils.h>

const String API_URL = BASE_API_URL;
const String IOT_DEVICE_ID = DEVICE_ID;

using APIEventCallback = std::function<void(const bool&)>;

JsonDocument& getJsonDocument() {
    static JsonDocument jsonDoc;
    jsonDoc.clear();
    return jsonDoc;
}

String handle_api_request(const String& endpoint, const JsonDocument& payload) {
    Serial.println("Calling API for endpoint: " + endpoint);

    String url = API_URL + endpoint;

    String jsonData;
    serializeJson(payload, jsonData);

    String response = call_api(url, HttpMethod::POST, jsonData);
    Serial.println("API Response: " + response);
    return response;
}

void handle_api_response(const String& responsePayload, APIEventCallback onSuccessCallback) {
    DynamicJsonDocument responseDoc(256);
    DeserializationError error = deserializeJson(responseDoc, responsePayload);

    if (error) {
        Serial.println("Failed to parse API response: " + String(error.c_str()));
        return;
    }
    String message = responseDoc["message"] | "";
    message.trim();
    if (message == "Authentication successful") {
        Serial.println("Login successful, spinning the servo...");
        if (onSuccessCallback) {
            onSuccessCallback(true);
        }
    } else {
        Serial.println("Authentication failed or server error.");
        if (onSuccessCallback) {
            onSuccessCallback(false);
        }
    }
    responseDoc.clear();
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

    JsonDocument& jsonDoc = getJsonDocument();
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for password login");
        return;
    }

    String password = jsonDoc["password"] | "";
    password.trim();
    if (!password.isEmpty()) {
        jsonDoc.clear();
        clear_display();
        print_to_lcd(0, "Please Wait...");
        build_auth_payload(jsonDoc, "password", password);
        String request = handle_api_request("/auth/device", jsonDoc);
        handle_api_response(request, [](const bool& status) {
            if (status) {
                clear_display();
                print_to_lcd(0, "Login Success");
                spin_servo_on_success();
                
            }else {
                print_to_lcd(0, "Login Failed");
                delay(1000);
            }
            clear_display();
            print_to_lcd(0, "Welcome, User");
            print_to_lcd(1, "Please Choice");
        });
    } else {
        Serial.println("Password field is empty");
    }
}

void handle_rfid_login(const String& payload) {
    Serial.println("Authenticating with RFID...");

    JsonDocument& jsonDoc = getJsonDocument();
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for RFID login");
        return;
    }

    String rfid = jsonDoc["rfid"] | "";
    rfid.trim();

    if (!rfid.isEmpty()) {
        jsonDoc.clear();
        clear_display();
        print_to_lcd(0, "Please Wait...");
        build_auth_payload(jsonDoc, "rfid", rfid);
        String response = handle_api_request("/auth/device", jsonDoc);
        handle_api_response(response, [](const bool& status) {
            if (status) {
                print_to_lcd(0, "Login Success");
                spin_servo_on_success();
            }else {
                print_to_lcd(0, "Login Failed");
                delay(1000);
            }
            clear_display();
            print_to_lcd(0, "Welcome, User");
            print_to_lcd(1, "Please Choice");
        });
    } else {
        Serial.println("RFID field is empty");
    }
}

void handle_fingerprint_login(const String& payload) {
    Serial.println("Authenticating with fingerprint...");

    JsonDocument& jsonDoc = getJsonDocument();
    DeserializationError error = deserializeJson(jsonDoc, payload);

    if (error) {
        Serial.println("Invalid JSON payload for fingerprint login");
        return;
    }

    String fingerprint = jsonDoc["fingerprint"] | "";
    fingerprint.trim();

    if (!fingerprint.isEmpty()) {
        jsonDoc.clear();
        clear_display();
        print_to_lcd(0, "Please Wait...");
        build_auth_payload(jsonDoc, "fingerprint", fingerprint);
        String response = handle_api_request("/auth/device", jsonDoc);
        handle_api_response(response, [](const bool& status) {
            if (status) {
                print_to_lcd(0, "Login Success");
                spin_servo_on_success();
            }else {
                print_to_lcd(0, "Login Failed");
                delay(1000);
            }
            clear_display();
            print_to_lcd(0, "Welcome, User");
            print_to_lcd(1, "Please Choice");
        });
    } else {
        Serial.println("Fingerprint field is empty");
    }
}
