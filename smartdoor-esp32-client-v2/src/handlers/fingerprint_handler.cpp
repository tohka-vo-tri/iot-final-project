#include "handlers/fingerprint_handler.h"
#include "utils/fingerprint_utils.h"
#include "events/input_mode.h"
#include "services/auth_service.h"
#include "utils/lcd_utils.h"
#include "handlers/door_handler.h"
#include "utils/led_utils.h"

void handle_fingerprint_authentication(int fingerID);
void handle_fingerprint_registration(int fingerID);

void init_fingerprint_device() {
    init_fingerprint_sensor();
}

void handle_fingerprint_input() {
    if (currentMode != InputMode::FINGERPRINT) return;

    // Serial.println("🔍 Waiting for finger...");
    int fingerID = get_fingerprint();

    if (fingerID == -2) {
        return;
    }

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
    // Step 1: Check if a valid fingerprint is detected (fingerID != 0 means it's already registered)
    if (fingerID > 0) {
        Serial.print("❌ Fingerprint already exists! ID: ");
        Serial.println(fingerID);
        Serial.println("Registration aborted.");
        clear_display();
        print_to_lcd(0, " Finger Exists");
        print_to_lcd(1, "Try Another Finger");
        delay(2000); // Delay to allow user to notice the message
        return;
    }

    // Step 2: Proceed with enrollment if no existing fingerprint is detected
    Serial.println("🔍 No match found. Proceeding with registration.");
    enroll_fingerprint();

    // Step 3: Check if enrollment was successful
    if (registerID == 0) {
        Serial.println("❌ Enrollment failed due to an error.");
        clear_display();
        print_to_lcd(0, "Enroll Failed");
        print_to_lcd(1, "Try Again");
        delay(2000); // Delay to notify the user
        return;
    }

    // Step 4: Send the newly registered fingerprint ID to the server
    String fingerIDStr = String(registerID);
    Serial.print("📤 Sending Fingerprint ID to server: ");
    Serial.println(fingerIDStr);

    handle_fingerprint_register(fingerIDStr, [fingerIDStr](const bool &success) {
        clear_display();
        if (success) {
            digitalWrite(LED_GREEN, HIGH);  // Bật LED xanh khi thành công
            digitalWrite(LED_RED, LOW);
            print_to_lcd(0, "Register Success");
            delay(2000);
            digitalWrite(LED_GREEN, LOW);  // Tắt LED xanh sau khi mở cửa
            clear_display();
            print_to_lcd(0, "Welcome, User");
            print_to_lcd(1, "Please Choose");
            registerID = 0; // Reset after successful registration
        } else {
            digitalWrite(LED_RED, HIGH);  // Bật LED đỏ khi thất bại
            digitalWrite(LED_GREEN, LOW);
            print_to_lcd(0, "Register Failed");
            print_to_lcd(1, "Try Again");
            delay(2000);
            digitalWrite(LED_RED, LOW);  // Tắt LED đỏ sau khi thất bại
            // Xóa mẫu vân tay trên cảm biến nếu server từ chối
            if (finger.deleteModel(fingerIDStr.toInt()) == FINGERPRINT_OK) {
                Serial.println("✅ Fingerprint deleted successfully from sensor.");
            } else {
                Serial.println("⚠️ Failed to delete fingerprint from sensor.");
            }
            registerID = 0; // Ensure reset even in failure cases
            delay(2000);
        }
    });
}


void handle_fingerprint_authentication(int fingerID) {
    // if (fingerID == 0) {
    //     Serial.println("❌ No matching fingerprint found.");
    //     return;
    // }

    String fingerIDStr = String(fingerID);
    Serial.print("✅ Fingerprint Matched! ID: ");
    Serial.println(fingerIDStr);

    handle_fingerprint_login(fingerIDStr, [fingerID](const bool &success) {
        clear_display();
        if (success) {
            digitalWrite(LED_GREEN, HIGH);  // Bật LED xanh khi thành công
            digitalWrite(LED_RED, LOW);
            print_to_lcd(0, "Login Success");
            print_to_lcd(1, "Door Opened");
            spin_servo_on_success();
            delay(5000);
            digitalWrite(LED_GREEN, LOW);  // Tắt LED xanh sau khi mở cửa
            clear_display();
            print_to_lcd(0, "Welcome, User");
            print_to_lcd(1, "Please Choice");
        } else {
            digitalWrite(LED_RED, HIGH);  // Bật LED đỏ khi thất bại
            digitalWrite(LED_GREEN, LOW);
            print_to_lcd(0, "Login Failed");
            print_to_lcd(1, "Door Close");
            delay(2000);
            digitalWrite(LED_RED, LOW);  // Tắt LED đỏ sau khi thất bại
            clear_display();
            print_to_lcd(0, "Enter Fingerprint");
        }
        
    });
}

