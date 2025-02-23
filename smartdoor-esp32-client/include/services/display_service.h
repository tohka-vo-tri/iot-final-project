#ifndef DISPLAY_SERVICE_H
#define DISPLAY_SERVICE_H

#include <Arduino.h>

void handle_password_input_display(const String& payloads);
void handle_password_display(const String& payloads);
void handle_rfid_display(const String& payloads);
void handle_fingerprint_display(const String& payloads);

#endif