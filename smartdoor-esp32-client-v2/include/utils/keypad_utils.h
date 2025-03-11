#ifndef KEYPAD_UTILS_H
#define KEYPAD_UTILS_H

#include <Arduino.h>
#include <Keypad_I2C.h>
#include <Wire.h>

extern Keypad_I2C keypad;
extern String keyboardEnter;

void handle_keypad_input();

#endif