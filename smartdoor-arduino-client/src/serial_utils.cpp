#include "serial_utils.h"
#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

#define RX_PIN A2
#define TX_PIN A1

SoftwareSerial serial(RX_PIN, TX_PIN);

void setup_software_serial () {
    serial.begin(9600);
}

void send_data(String data, String key) {
    JsonDocument doc; doc;
    doc[key] = data;
    String jsonString;
    serializeJson(doc, jsonString);
    serial.println(jsonString);
    Serial.println(data);
}
String read_data() {
    if (serial.available()) {
        String receivedData = serial.readStringUntil('\n');
        Serial.print("Received: ");
        Serial.println(receivedData);
        return receivedData;
    }
    return "";
}