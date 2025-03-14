#ifndef AUTH_SERVICE_H
#define AUTH_SERVICE_H

#include <Arduino.h>
#include <functional>

using APIEventCallback = std::function<void(bool)>;

// Authentication and registration function declarations with callbacks
void handle_password_login(const String& password, APIEventCallback callback);
void handle_fingerprint_login(const String& fingerprint, APIEventCallback callback);
void handle_rfid_login(const String& rfid, APIEventCallback callback);
void handle_fingerprint_register(const String& fingerprint, APIEventCallback callback);
void handle_rfid_register(const String& rfid, APIEventCallback callback);

#endif
