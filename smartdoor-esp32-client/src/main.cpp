#include <Arduino.h>
#include "lcd_utils.h"
#include "wifi_utils.h"

void setup() {
  Serial.begin(9600);
  setup_lcd_device();
  print_to_lcd(0, "Hello DCMM");
  // setup_internet_connection();
}

void loop() {
  
}