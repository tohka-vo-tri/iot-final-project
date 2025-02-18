#include "serial_utils.h"
#include <Arduino.h>

#define TX2_PIN 17
#define RX2_PIN 16

void setup_serial() {
    Serial2.begin(9600, SERIAL_8N1, RX2_PIN, TX2_PIN); 
}
void send_data(String data) {
    Serial2.println(data);
}
String read_data() {
    if (Serial2.available()) {
        String receivedData = Serial2.readStringUntil('\n');
        Serial.print("Received: ");
        Serial.println(receivedData);
        return receivedData;
    }
    return "";
}
