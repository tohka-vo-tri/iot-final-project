#include "handlers/rfid_handler.h"
#include <Arduino.h>
#include "events/input_mode.h"
#include "services/auth_service.h"
#include "utils/lcd_utils.h"
#include "handlers/door_handler.h"
#include "utils/serial_utils.h"
void init_rfid_device() {
    setup_software_serial();
}

void handle_rfid_input() {
    if (currentMode != InputMode::RFID) return;
    String uidString = read_data("RFID");
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
                print_to_lcd(0, "Register RFID");
                print_to_lcd(1, "PUt RFID");
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
                delay(2000);
                clear_display();
                print_to_lcd(0, "Enter RFID");
            }
        });
    }
}
