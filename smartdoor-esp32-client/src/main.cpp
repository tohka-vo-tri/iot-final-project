#include <Arduino.h>
#include <ArduinoJson.h>
#include "utils/lcd_utils.h"
#include "utils/wifi_utils.h"
#include "utils/serial_utils.h"
#include "events/event_emitter.h"
#include "services/auth_service.h"
#include "services/display_service.h"
void setup()
{
  Serial.begin(9600);
  setup_lcd_device();
  setup_serial();
  // setup_internet_connection();
  on_event("PASSWORD_LOGIN", handle_password_login);
  on_event("PASSWORD_INPUT", handle_password_input_display);
}

void loop()
{
  String input = read_data();
  if (!input.isEmpty()) {
    emit_event(input);
  }
}