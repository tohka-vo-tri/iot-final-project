#ifndef SERIAL_UTILS_H
#define SERIAL_UTILS_H

#include <Arduino.h>

void send_data(String data);
String read_data();
void setup_serial();

#endif
