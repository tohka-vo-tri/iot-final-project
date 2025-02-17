#include <Arduino.h>
#include "lcd_utils.h"
#include "keypad_utils.h"
#include "wifi_utils.h"
#include "rfid_utils.h"

void setup() {
  Serial.begin(9600);
  setup_lcd_device();
  setup_internet_connection();
  setup_rfid();
}

void loop() {
  handle_keypad_input();
}