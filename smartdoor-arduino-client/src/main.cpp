#include <Arduino.h>
#include "utils/keypad_utils.h"
#include "utils/rfid_utils.h"
#include "utils/serial_utils.h"
#include "events/event_producer.h"
#include "events/input_mode.h"

InputMode currentMode = InputMode::NONE;

void setup() {
  Serial.begin(9600);
  setup_rfid();
  setup_software_serial();
}

void loop() {
  handle_rfid();
  handle_keypad_input();
}