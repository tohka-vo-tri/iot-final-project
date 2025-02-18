#include <Arduino.h>
#include <ArduinoJson.h>
#include "lcd_utils.h"
#include "wifi_utils.h"
#include "serial_utils.h"
void setup()
{
  Serial.begin(9600);
  setup_lcd_device();
  setup_serial();
  // setup_internet_connection();
}

void loop()
{
  String input = read_data();
  JsonDocument doc;
  if (input != "")
  {
    DeserializationError error = deserializeJson(doc, input);

    if (!error)
    {
      const String status = doc["password_input"];
      print_to_lcd(0, "Enter Pwd:");
      print_to_lcd(1, status);
    }
    else
    {
      Serial.printf("Error Reading");
    }
  }
}