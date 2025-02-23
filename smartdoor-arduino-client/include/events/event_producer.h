#ifndef EVENT_PRODUCER_H
#define EVENT_PRODUCER_H

#include <Arduino.h>

enum EventType {
    PASSWORD_LOGIN,
    FINGERPRINT_LOGIN,
    RFID_LOGIN,
    PASSWORD_INPUT,
    RFID_MODE_DISPLAY,
    PASSWORD_MODE_DISPLAY,
    FINGERPRINT_MODE_DISPLAY
};

void trigger_event(EventType eventType, const String &payload);

#endif