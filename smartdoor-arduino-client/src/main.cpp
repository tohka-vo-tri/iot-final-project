#include <Arduino.h>
#include "keypad_utils.h"
#include "rfid_utils.h"
#include "serial_utils.h"
void setup() {
  Serial.begin(9600);
  setup_rfid();
  setup_software_serial();
}

void loop() {
  handle_rfid();
  handle_keypad_input();
}