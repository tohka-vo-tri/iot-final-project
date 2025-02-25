#include <Arduino.h>
#include <ArduinoJson.h>
#include "utils/lcd_utils.h"
#include "utils/wifi_utils.h"
#include "utils/serial_utils.h"
#include "events/event_emitter.h"
#include "services/auth_service.h"
#include "services/display_service.h"
#include "handlers/door_handler.h"
void setup()
{
  // Setup Process
  Serial.begin(9600);
  setup_lcd_device();
  setup_serial();
  setup_internet_connection();
  setup_door_handler();
  // Auth Process
  on_event("PASSWORD_LOGIN", handle_password_login);
  on_event("FINGERPRINT_LOGIN", handle_fingerprint_login);
  on_event("RFID_LOGIN", handle_rfid_login);
  // Display Info Process
  on_event("PASSWORD_INPUT", handle_password_input_display);
  on_event("RFID_MODE_DISPLAY", handle_rfid_display);
  on_event("PASSWORD_MODE_DISPLAY", handle_password_display);
  on_event("FINGERPRINT_MODE_DISPLAY", handle_fingerprint_display);
  print_to_lcd(0, "Welcome, User");
  print_to_lcd(1, "Please Choice");
}

void loop()
{
  String input = read_data();
  if (!input.isEmpty()) {
    emit_event(input);
  }
}