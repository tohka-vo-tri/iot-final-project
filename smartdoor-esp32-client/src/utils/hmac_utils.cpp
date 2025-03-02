#include <Crypto.h>
#include <SHA256.h>
#include <Arduino.h>
#include "utils/hmac_utils.h"
SHA256 sha256;
const String SECRET_KEY = HMAC_SECRET_KEY;

String createHMAC(String message) {
    byte hash[32];
    const char* key = SECRET_KEY.c_str();
    const char* msg = message.c_str();
    sha256.resetHMAC((const uint8_t*)key, SECRET_KEY.length());
    sha256.update((const uint8_t*)msg, message.length());
    sha256.finalizeHMAC((const uint8_t*)key, SECRET_KEY.length(), hash, sizeof(hash));
    String signature = "";
    for (int i = 0; i < 32; i++) {
        if (hash[i] < 0x10) signature += "0";
        signature += String(hash[i], HEX);
    }

    return signature;
}
