#ifndef AUTH_SERVICE_H
#define AUTH_SERVICE_H

#include <Arduino.h>

void handle_password_login(const String& payload);
void handle_fingerprint_login(const String& payload);
void handle_rfid_login(const String& payload);
void handle_fingerprint_register(const String& payload);
void handle_rfid_register(const String& payload);
#endif