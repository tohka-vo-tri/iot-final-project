#include "handlers/fingerprint_handler.h"
#include "utils/fingerprint_utils.h"
#include "events/input_mode.h"
#include "services/auth_service.h"
#include "utils/lcd_utils.h"
#include "handlers/door_handler.h"
void init_fingerprint_device() {
    init_fingerprint_sensor();
}

void handle_fingerprint_input() {
    if (currentMode != InputMode::FINGERPRINT) return;

    Serial.println("🔍 Checking fingerprint...");
    int fingerID = get_fingerprint();

    if (fingerID == -1) {
        Serial.println("⚠️ Fingerprint read error.");
        return;
    }

    if (isRegisterMode) {
        handle_fingerprint_registration(fingerID);
    } else {
        handle_fingerprint_authentication(fingerID);
    }
}

void handle_fingerprint_registration(int fingerID) {
    if (fingerID != 0) {
        Serial.println("❌ Fingerprint already exists! Registration aborted.");
        return;
    }

    enroll_fingerprint();

    if (registerID == 0) {
        Serial.println("❌ Enrollment failed.");
        return;
    }

    String fingerIDStr = String(registerID);
    Serial.print("📤 Sending Fingerprint ID to server: ");
    Serial.println(fingerIDStr);

    handle_fingerprint_register(fingerIDStr, [](const bool &success) {
        clear_display();
        if (success) {
            print_to_lcd(0, "✅ Register Success");
            delay(1000);
        } else {
            print_to_lcd(0, "❌ Register Failed");
            print_to_lcd(1, "Try Again");
            delay(2000);
        }
        print_to_lcd(0, "Welcome, User");
        print_to_lcd(1, "Please Choose");
    });
}

void handle_fingerprint_authentication(int fingerID) {
    if (fingerID == 0) {
        Serial.println("❌ No matching fingerprint found.");
        return;
    }

    String fingerIDStr = String(fingerID);
    Serial.print("✅ Fingerprint Matched! ID: ");
    Serial.println(fingerIDStr);

    handle_fingerprint_login(fingerIDStr, [fingerID](const bool &success) {
        clear_display();
        if (success) {
            print_to_lcd(0, "✅ Login Success");
            print_to_lcd(1, "Door Opened");
            spin_servo_on_success();
        } else {
            Serial.println("❌ Server authentication failed! Deleting fingerprint...");

            if (finger.deleteModel(fingerID) == FINGERPRINT_OK) {
                Serial.println("✅ Fingerprint deleted successfully.");
                print_to_lcd(0, "❌ Login Failed");
                print_to_lcd(1, "Fingerprint Deleted");
            } else {
                Serial.println("❌ Failed to delete fingerprint!");
                print_to_lcd(0, "❌ Login Failed");
                print_to_lcd(1, "Delete Error");
            }

            delay(2000);
        }
        print_to_lcd(0, "Enter Fingerprint");
    });
}

