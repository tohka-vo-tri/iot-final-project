#ifndef FINGERPRINT_UTILS_H
#define FINGERPRINT_UTILS_H

#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <Arduino.h>

#define FINGERPRINT_RX 16
#define FINGERPRINT_TX 17

extern SoftwareSerial mySerial;
extern Adafruit_Fingerprint finger;

void init_fingerprint_sensor();
int get_fingerprint();
void enroll_fingerprint();
void handle_fingerprint();

#endif
