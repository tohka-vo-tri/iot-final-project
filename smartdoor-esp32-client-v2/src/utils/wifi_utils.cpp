#include "utils/wifi_utils.h"
#include <WiFi.h>
#include "utils/lcd_utils.h"

const String ssid = WIFI_SSID;
const String password = WIFI_PASS;

void setup_internet_connection() {
  Serial.println(ssid);
  Serial.println(password);
  WiFi.begin(String(ssid.c_str()), String(password.c_str()));
  print_to_lcd(0, "Connect To WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  print_to_lcd(0, "WiFi Connected!");
  delay(1000);
  clear_display();
}
