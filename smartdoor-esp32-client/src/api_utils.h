#ifndef API_UTILS_H
#define API_UTILS_H
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Enum to represent HTTP methods
enum HttpMethod {
  GET,
  POST
};

// Function to call API with GET or POST method
String call_api(String endpoint, HttpMethod method, String data = "");

#endif
