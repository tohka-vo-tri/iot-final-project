#ifndef RFID_UTILS_H
#define RFID_UTILS_H

#include <MFRC522.h>

extern MFRC522 mfrc522;

void setup_rfid();
void handle_rfid();

#endif