#include "utils/rfid_utils.h"
#include "events/input_mode.h"
#include <ArduinoJson.h>
#include <MFRC522.h>
#include <SPI.h>
#define RST_PIN 5
#define SS_PIN 2
MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup_rfid() {
  Serial.println("RFID reader initialized");
  SPI.begin();
  mfrc522.PCD_Init();
}

void handle_rfid() {
  if (currentMode != InputMode::RFID) return;

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
    mfrc522.PICC_HaltA();
    Serial.println(uidString);
    JsonDocument doc;
    doc["rfid"] = uidString;
    String jsonString;
    serializeJson(doc, jsonString);
    if (isRegisterMode) {
      isRegisterMode = false;
    }else {
    }
    
    currentMode = InputMode::NONE;
}