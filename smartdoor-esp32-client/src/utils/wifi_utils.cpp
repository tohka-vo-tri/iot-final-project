#include "utils/wifi_utils.h"
#include <WiFi.h>
#include "utils/lcd_utils.h"

const String ssid = "your_SSID";
const String password = "your_PASSWORD";

void setup_internet_connection() {
  WiFi.begin(ssid.c_str(), password.c_str());
  print_to_lcd(0, "Connect To WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  print_to_lcd(0, "WiFi Connected!");
  print_to_lcd(1, "Ready");
}
