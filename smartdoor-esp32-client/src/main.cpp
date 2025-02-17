#include <Arduino.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

const int LCD_SDA_PIN = 21;
const int LCD_SCL_PIN = 22;

LiquidCrystal_I2C lcd(0x00,16,2);

byte scan_i2c_address();
void setup_lcd_device ();

void setup() {
  Serial.begin(9600);
  setup_lcd_device();
}

void loop() {
}

void setup_lcd_device () {
  Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN);
  byte lcdAddress = scan_i2c_address();
  if (lcdAddress != 0) {
    Serial.print("LCD Address Found");
    Serial.println(lcdAddress, HEX);
    lcd = LiquidCrystal_I2C(lcdAddress, 16,2);
    lcd.init();
    lcd.backlight();
  }
}

void print_to_lcd (byte row, String message) {
   if (row < 0 || row > 1) {
    Serial.println("Invalid row number.  Must be 0 or 1.");
    return;
  }
  lcd.setCursor(0, row);
  for (int i = 0; i < 16; i++) {
    lcd.print(" ");
  }
  lcd.setCursor(0, row);
  lcd.print(message);
}

byte scan_i2c_address() {
  byte error, address;
  int nDevices = 0;

  Serial.println("Scanning I2C addresses...");

  for (address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
      nDevices++;
      return address;
    } else if (error == 4) {
      Serial.print("Unknown error at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
    }
  }

  if (nDevices == 0) {
    Serial.println("No I2C devices found");
  } else {
    Serial.println("done");
  }
  return 0;
}