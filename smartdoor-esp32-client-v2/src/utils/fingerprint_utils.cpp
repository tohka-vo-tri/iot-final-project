#include "utils/fingerprint_utils.h"
#include <Adafruit_Fingerprint.h>
#include "events/input_mode.h"
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t registerID = 0;
int enrollStep = 0;

void init_fingerprint_sensor() {
    mySerial.begin(57600, SERIAL_8N1, FINGERPRINT_RX, FINGERPRINT_TX);
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
        Serial.print("🔍 Assigned ID: ");
        Serial.println(registerID);
    }

    Serial.println("🟢 Place your finger on the sensor...");

    while (finger.getImage() != FINGERPRINT_OK) {
        delay(100);
    }
    Serial.println("✅ Finger detected.");

    if (finger.image2Tz(1) != FINGERPRINT_OK) {
        Serial.println("❌ Failed to process fingerprint!");
        return;
    }
    Serial.println("✅ Fingerprint image converted.");

    if (finger.createModel() != FINGERPRINT_OK) {
        Serial.println("❌ Fingerprint creation failed!");
        return;
    }
    Serial.println("✅ Fingerprint template created.");

    if (finger.storeModel(registerID) == FINGERPRINT_OK) {
        Serial.print("🎉 Fingerprint stored successfully with ID: ");
        Serial.println(registerID);
    } else {
        Serial.println("❌ Failed to store fingerprint!");
    }

    isRegisterMode = false;
    enrollStep = 0;
    registerID = 0;
}



int get_fingerprint() {
    int result = finger.getImage();
    if (result != FINGERPRINT_OK) return -1;
    
    result = finger.image2Tz(1);
    if (result != FINGERPRINT_OK) return -2;
    
    result = finger.fingerFastSearch();
    return (result == FINGERPRINT_OK) ? finger.fingerID : 0;
}
