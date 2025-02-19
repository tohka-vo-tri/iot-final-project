#ifndef AUTH_SERVICE_H
#define AUTH_SERVICE_H

#include <Arduino.h>

void handle_password_login(const String& payload);
void handle_fingerprint_login(const String& payload);
void handle_rfid_login(const String& payload);
void handle_fingerprint_signup(const String& payload);
void handle_rfid_signup(const String& payload);

#endif