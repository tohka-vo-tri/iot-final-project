#include "utils/serial_utils.h"
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
    String compress = key + ":" + data;
    serial.println(compress);
    Serial.println(compress);
}