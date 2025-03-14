#include "handlers/rfid_handler.h"
#include <Arduino.h>
#include "utils/rfid_utils.h"
#include "events/input_mode.h"
#include "services/auth_service.h"
#include "utils/lcd_utils.h"
#include "handlers/door_handler.h"
void init_rfid_device() {
    init_rfid();
}

void handle_rfid_input() {
    if (currentMode != InputMode::RFID) return;
    if (!is_rfid_card_present()) return;

    String uidString = read_rfid_uid();
    Serial.print("UID tag: ");
    Serial.println(uidString);

    if (isRegisterMode) {
        handle_rfid_register(uidString, [](const bool &success) {
            if (success) {
                clear_display();
                print_to_lcd(0, "Register Success");
                clear_display();
                print_to_lcd(0, "Welcome, User");
                print_to_lcd(1, "Please Choice");

            } else {
                clear_display();
                print_to_lcd(0, "Register Failed");
                print_to_lcd(1, "Door Lock");
                delay(2000);
                clear_display();
                print_to_lcd(0, "Welcome, User");
                print_to_lcd(1, "Please Choice");
            }
        });
    } else {
        handle_rfid_login(uidString, [](const bool &success) {
            if (success) {
                clear_display();
                print_to_lcd(0, "Login Success");
                print_to_lcd(1, "Door Opened");
                spin_servo_on_success();
                clear_display();
                print_to_lcd(0, "Welcome, User");
                print_to_lcd(1, "Please Choice");

            } else {
                clear_display();
                print_to_lcd(0, "Login Failed");
                print_to_lcd(1, "Door Lock");
                delay(2000);
                clear_display();
                print_to_lcd(0, "Enter RFID");
            }
        });
    }
}
