#include <Arduino.h>
#include <Keypad.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>

#define RFID_SS_PIN 10
#define RFID_RST_PIN 9

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
MFRC522 mfrc522(RFID_SS_PIN, RFID_RST_PIN);

const String ssid = "your_SSID";
const String password = "your_PASSWORD";

byte scan_i2c_address();
void setup_lcd_device ();
void handle_keypad_input();
void setup_rfid();
void handle_rfid();

void setup() {
  Serial.begin(9600);
  setup_lcd_device();
}

void loop() {
  handle_keypad_input();
}

void setup_internet_connection() {
  WiFi.begin(ssid, password);
  print_to_lcd(0, "Connect To WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  print_to_lcd(0, "WiFi Connected!");
  print_to_lcd(1, "Ready");
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

void setup_rfid() {
  SPI.begin();
  mfrc522.PCD_Init();
}

void handle_rfid() {
  String uidString = "";
  if (!mfrc522.PICC_IsNewCardPresent()) {
      return;
  }
  if (!mfrc522.PICC_ReadCardSerial()) {
      return;
  }
  Serial.print("UID tag: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println(uidString);
  mfrc522.PICC_HaltA();
}

String call_api(String endpoint, const String data) {
  WiFiClient client;
  HTTPClient http;
  String response = "";

  http.begin(client, endpoint);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded"); // Adjust header if needed

  int httpResponseCode = http.POST(data);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode == 200) {
      response = http.getString();
      Serial.println("API Response: " + response);
    } else {
      Serial.print("API returned an error: ");
      Serial.println(httpResponseCode);
    }
  } else {
    Serial.print("Error calling API: ");
    Serial.println(httpResponseCode);
  }
  http.end();
  return response;
} 