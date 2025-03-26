#include <Arduino.h>
#include <ArduinoJson.h>
#include "utils/lcd_utils.h"
#include "utils/led_utils.h"
#include "utils/wifi_utils.h"
#include "handlers/door_handler.h"
#include "handlers/keyboard_handler.h"
#include "handlers/fingerprint_handler.h"
#include "handlers/rfid_handler.h"
#include "events/input_mode.h"
#define LED_GREEN 2   // Chân GPIO 2 cho LED xanh
#define LED_RED 15

InputMode currentMode = InputMode::NONE;
bool isRegisterMode = false;
void setup()
{
  Serial.begin(9600);

  init_leds();
  init_rfid_device();
  setup_lcd_device();
  setup_door_handler();
  init_fingerprint_device();
  setup_internet_connection();
  print_to_lcd(0, "Welcome, User");
  print_to_lcd(1, "Please Choice");
}

void loop()
{
  handle_keypad_input();
  handle_fingerprint_input();
  handle_rfid_input();
}