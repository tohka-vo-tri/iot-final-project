#include "utils/api_utils.h"
#include <Arduino.h>
String call_api(String endpoint, HttpMethod method, String data) {
  WiFiClient client;
  HTTPClient http;
  String response = "";

  http.begin(client, endpoint);

  if (method == POST) {
    http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  }

  int httpResponseCode = -1;
  if (method == GET) {
    httpResponseCode = http.GET();
  } else if (method == POST) {
    httpResponseCode = http.POST(data);
  }

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode == 200) {
      response = http.getString();
      Serial.println("API Response: " + response);
    } else {
      Serial.print("Error from API: ");
      Serial.println(httpResponseCode);
    }
  } else {
    Serial.print("Error calling API: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  return response;
}
