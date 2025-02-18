#include <Arduino.h>
#include "keypad_utils.h"
#include "rfid_utils.h"
void setup() {
  Serial.begin(9600);
  setup_rfid();
}

void loop() {
  handle_rfid();
  handle_keypad_input();
}