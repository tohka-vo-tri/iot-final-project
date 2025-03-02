#ifndef INPUT_MODE_H
#define INPUT_MODE_H

enum class InputMode {
    NONE,
    PASSWORD,
    FINGERPRINT,
    RFID
};
extern InputMode currentMode;
extern bool isRegisterMode;

#endif
