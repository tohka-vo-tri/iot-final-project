#ifndef RFID_UTILS_H
#define RFID_UTILS_H

#include <Arduino.h>
#include <MFRC522.h>

extern MFRC522 mfrc522;

void init_rfid();
bool is_rfid_card_present();
String read_rfid_uid();

#endif
