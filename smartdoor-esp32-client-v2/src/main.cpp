#include <Arduino.h>
#include <ArduinoJson.h>
#include "utils/lcd_utils.h"
#include "utils/wifi_utils.h"
#include "utils/serial_utils.h"
#include "utils/rfid_utils.h"
#include "utils/keypad_utils.h"
#include "services/auth_service.h"
#include "services/display_service.h"
#include "handlers/door_handler.h"
void setup()
{
  Serial.begin(9600);
  setup_internet_connection();
  setup_lcd_device();
  setup_door_handler();
  setup_rfid();
  setup_software_serial();
  print_to_lcd(0, "Welcome, User");
  print_to_lcd(1, "Please Choice");
}

void loop()
{
  handle_rfid();
  handle_keypad_input();
}