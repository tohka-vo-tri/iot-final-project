#include <Arduino.h>
#include <Keypad.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

const int LCD_SDA_PIN = 21;
const int LCD_SCL_PIN = 22;

const byte KEYPAD_ROWS = 4;
const byte KEYPAD_COLS = 4;

char keys[KEYPAD_ROWS][KEYPAD_COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte rowPins[KEYPAD_ROWS] = {2, 3, 4, 5};
byte colPins[KEYPAD_COLS] = {6, 7, 8, 9};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, KEYPAD_ROWS, KEYPAD_COLS);
String keyboardEnter = "";
LiquidCrystal_I2C lcd(0x00,16,2);

byte scan_i2c_address();
void setup_lcd_device ();
void handle_keypad_input();

void setup() {
  Serial.begin(9600);
  setup_lcd_device();
}

void loop() {
  handle_keypad_input();
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

void handle_keypad_input() {
  char key = keypad.getKey();
  if (key) {
    Serial.print("Key pressed: ");
    Serial.println(key);
    if (key == '#') {
      Serial.print("You entered: ");
      Serial.println(keyboardEnter);
      print_to_lcd(0, "You entered:");
      print_to_lcd(1, keyboardEnter);
      keyboardEnter = "";
    } else if (key == '*') {
      keyboardEnter = "";
      print_to_lcd(0, "Enter Your Password");
      print_to_lcd(1, "");
    } else {
      keyboardEnter += key;
      print_to_lcd(1, keyboardEnter);
      if (keyboardEnter.length() > 16) {
        keyboardEnter = keyboardEnter.substring(1);
      }
    }
  }
}