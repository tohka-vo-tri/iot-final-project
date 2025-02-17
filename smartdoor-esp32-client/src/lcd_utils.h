#ifndef LCD_UTILS_H
#define LCD_UTILS_H

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Arduino.h>

extern LiquidCrystal_I2C lcd;

void setup_lcd_device();
byte scan_i2c_address();
void print_to_lcd(byte row, String message);

#endif
