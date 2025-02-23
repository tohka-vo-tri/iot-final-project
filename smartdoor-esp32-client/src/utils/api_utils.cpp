#include "utils/api_utils.h"
#include <Arduino.h>
String call_api(String endpoint, HttpMethod method, String data) {
  WiFiClientSecure client;
  client.setInsecure();
  client.setTimeout(5000);
  HTTPClient http;
  String response = "";

  Serial.println("Endpoint: " + endpoint);
  Serial.println("Request Data: " + data);

  http.begin(client, endpoint);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = -1;

  if (method == HttpMethod::GET) {
    httpResponseCode = http.GET();
  } 
  else if (method == HttpMethod::POST) {
    httpResponseCode = http.POST(data);
  }

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);

  if (httpResponseCode > 0) {
    response = http.getString();
    Serial.println("API Response: " + response);
  } else {
    Serial.println("Error calling API");
  }

  http.end();
  return response;
}
