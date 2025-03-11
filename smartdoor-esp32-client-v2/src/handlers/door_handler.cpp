#include "handlers/door_handler.h"
#include <Arduino.h>
#include <ESP32Servo.h>

Servo doorServo;
const int SERVO_PIN = 18;
const int OPEN_ANGLE = 90;
const int CLOSE_ANGLE = 0;
const int SPIN_DURATION = 3000;

void setup_door_handler() {
    ESP32PWM::allocateTimer(0);
	ESP32PWM::allocateTimer(1);
	ESP32PWM::allocateTimer(2);
	ESP32PWM::allocateTimer(3);
    doorServo.setPeriodHertz(50);
    doorServo.attach(SERVO_PIN, 500, 2400);
    doorServo.write(CLOSE_ANGLE);
}
void spin_servo_on_success() {
    Serial.println("Access granted! Spinning servo...");
    doorServo.write(OPEN_ANGLE);
    delay(SPIN_DURATION);
    doorServo.write(CLOSE_ANGLE);
    Serial.println("Servo returned to default position.");
}
