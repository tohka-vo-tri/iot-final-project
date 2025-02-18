#include "rfid_utils.h"
#include <MFRC522.h>
#include <SPI.h>
#define RST_PIN A0
#define SS_PIN 10
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup_rfid() {
  Serial.println("RFID reader initialized");
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
