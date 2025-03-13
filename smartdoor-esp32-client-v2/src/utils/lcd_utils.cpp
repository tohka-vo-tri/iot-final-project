#include "utils/lcd_utils.h"
#include "utils/i2c_address_utils.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define SDA_PIN 16
#define SCL_PIN 17

LiquidCrystal_I2C lcd(0x00, 16, 2);

void setup_lcd_device () {
   Wire.begin(SDA_PIN, SCL_PIN);
  lcd = LiquidCrystal_I2C(0x27, 16, 2);
  lcd.setBacklight(true);
}

void print_to_lcd(byte row, String message) {
   if (row < 0 || row > 1) {
    Serial.println("Invalid row number.  Must be 0 or 1.");
    return;
  }
  lcd.setCursor(0, row);
  lcd.setCursor(0, row);
  lcd.print(message);
}

void clear_display() {
  lcd.clear();
}