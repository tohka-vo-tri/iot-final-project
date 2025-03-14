#include "utils/rfid_utils.h"
#include <SPI.h>

#define SS_PIN 2
#define RST_PIN 5

MFRC522 mfrc522(SS_PIN, RST_PIN);

void init_rfid() {
    SPI.begin();
    mfrc522.PCD_Init();
}

bool is_rfid_card_present() {
    return mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial();
}

String read_rfid_uid() {
    String uidString = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
        uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
        uidString += String(mfrc522.uid.uidByte[i], HEX);
    }
    mfrc522.PICC_HaltA();
    return uidString;
}
