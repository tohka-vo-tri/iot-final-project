#ifndef SERIAL_UTILS_H
#define SERIAL_UTILS_H

#include <Arduino.h>
#include <ArduinoJson.h>
void send_data(String data, String key);
String read_data();
void setup_software_serial();
bool convert_payload_to_jsondoc(const String& payload, JsonDocument& doc);
#endif