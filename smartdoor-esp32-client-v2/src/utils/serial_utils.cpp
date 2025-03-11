#include "utils/serial_utils.h"
#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

#define RX_PIN 1
#define TX_PIN 2

SoftwareSerial serial(RX_PIN, TX_PIN);

void setup_software_serial () {
    serial.begin(9600);
}

void send_data(String data, String key) {
    String compress = key + ":" + data;
    serial.println(compress);
    Serial.println(compress);
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

bool convert_payload_to_jsondoc(const String& payload, JsonDocument& doc)
{
    if (!payload.isEmpty())
    {
        DeserializationError error = deserializeJson(doc, payload);

        if (!error)
        {
            return true;
        }
        else
        {
            Serial.print("JSON deserialization failed: ");
            Serial.println(error.c_str());
        }
    }
    else
    {
        Serial.println("Payload is empty!");
    }

    doc.clear();

    return false;
}