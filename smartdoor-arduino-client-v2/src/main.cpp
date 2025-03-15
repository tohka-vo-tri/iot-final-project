#include <Arduino.h>
#include "utils/rfid_utils.h"
#include "utils/serial_utils.h"


void setup() {
  Serial.begin(9600);
  setup_rfid();
  setup_software_serial();
}

void loop() {
  handle_rfid();;
}
