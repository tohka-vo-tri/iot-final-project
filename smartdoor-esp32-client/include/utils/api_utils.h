#ifndef API_UTILS_H
#define API_UTILS_H
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

enum HttpMethod {
  GET,
  POST,
  PUT
};

String call_api(String endpoint, HttpMethod method, String data = "");

#endif
