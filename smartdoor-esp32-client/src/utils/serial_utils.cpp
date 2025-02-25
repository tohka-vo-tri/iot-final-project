#include "utils/serial_utils.h"
#include <Arduino.h>
#include <ArduinoJson.h>

#define TX2_PIN 17
#define RX2_PIN 16

void setup_serial()
{
    Serial2.begin(9600, SERIAL_8N1, RX2_PIN, TX2_PIN);
}
void send_data(String data)
{
    Serial2.println(data);
}
String read_data()
{
    if (Serial2.available())
    {
        String receivedData = Serial2.readStringUntil('\n');
        receivedData.trim();
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