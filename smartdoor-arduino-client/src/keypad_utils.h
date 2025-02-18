#ifndef KEYPAD_UTILS_H
#define KEYPAD_UTILS_H

#include <Keypad.h>

extern Keypad keypad;
extern String keyboardEnter;

void handle_keypad_input();

#endif