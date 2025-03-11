#include "utils/fingerprint_utils.h"
#include "events/input_mode.h"
#include <SoftwareSerial.h>
#include <Adafruit_Fingerprint.h>

SoftwareSerial mySerial(FINGERPRINT_RX, FINGERPRINT_TX);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t registerID = 0;
int enrollStep = 0;

void init_fingerprint_sensor() {
    finger.begin(57600);
    if (finger.verifyPassword()) {
        Serial.println("✅ Fingerprint sensor initialized successfully!");
    } else {
        Serial.println("❌ Failed to initialize fingerprint sensor!");
        while (1);
    }
}

uint8_t get_next_available_id() {
    for (uint8_t id = 1; id < 127; id++) {
        if (finger.loadModel(id) != FINGERPRINT_OK) {
            return id;
        }
    }
    return 0;
}

void enroll_fingerprint() {
    if (registerID == 0) {
        registerID = get_next_available_id();
        if (registerID == 0) {
            Serial.println("❌ No available ID slots for fingerprint registration!");
            isRegisterMode = false;
            return;
        }
    }

    int result;
    if (enrollStep == 0) {
        Serial.println("Place your finger on the sensor...");
        enrollStep = 1;
    }
    if (enrollStep == 1 && finger.getImage() == FINGERPRINT_OK) {
        if (finger.image2Tz(1) == FINGERPRINT_OK) {
            Serial.println("Remove your finger...");
            enrollStep = 2;
        } else {
            Serial.println("❌ Failed to capture fingerprint, try again.");
        }
    }
    if (enrollStep == 2 && finger.getImage() == FINGERPRINT_NOFINGER) {
        Serial.println("Place the same finger again...");
        enrollStep = 3;
    }
    if (enrollStep == 3 && finger.getImage() == FINGERPRINT_OK) {
        if (finger.image2Tz(2) == FINGERPRINT_OK) {
            if (finger.createModel() == FINGERPRINT_OK && finger.storeModel(registerID) == FINGERPRINT_OK) {
                Serial.print("✅ Fingerprint enrolled successfully with ID: ");
                Serial.println(registerID);
                isRegisterMode = false;
                enrollStep = 0;
                registerID = 0;
            } else {
                Serial.println("❌ Fingerprint enrollment failed!");
                enrollStep = 0;
            }
        } else {
            Serial.println("❌ Failed to capture fingerprint, try again.");
            enrollStep = 0;
        }
    }
}

int get_fingerprint() {
    int result = finger.getImage();
    if (result != FINGERPRINT_OK) return -1;
    
    result = finger.image2Tz(1);
    if (result != FINGERPRINT_OK) return -1;
    
    result = finger.fingerFastSearch();
    return (result == FINGERPRINT_OK) ? finger.fingerID : 0;
}

void handle_fingerprint() {
    if (currentMode != InputMode::FINGERPRINT) return;
    int reader = get_fingerprint();
    if (isRegisterMode) {
        enroll_fingerprint();
    } else {
        if (reader > 0) {
            Serial.print("✅ Fingerprint matched with ID: ");
            Serial.println(reader);
        } else if (reader == 0) {
            Serial.println("❌ No matching fingerprint found.");
        } else {
            Serial.println("⚠️ Fingerprint read error.");
        }
    }
}
