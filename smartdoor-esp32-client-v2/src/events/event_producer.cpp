#include "events/event_producer.h"
#include "utils/serial_utils.h"
void setup_event_producer() {
    Serial.begin(9600);
}

void trigger_event(EventType eventType, const String &payload) {
    String eventMessage;

    switch (eventType) {
        case PASSWORD_LOGIN:
            eventMessage = "EVENT:PASSWORD_LOGIN";
            break;
        case FINGERPRINT_LOGIN:
            eventMessage = "EVENT:FINGERPRINT_LOGIN";
            break;
        case RFID_LOGIN:
            eventMessage = "EVENT:RFID_LOGIN";
            break;
        case PASSWORD_INPUT:
            eventMessage = "EVENT:PASSWORD_INPUT";
            break;
        case RFID_MODE_DISPLAY:
            eventMessage = "EVENT:RFID_MODE_DISPLAY";
            break;
        case PASSWORD_MODE_DISPLAY:
            eventMessage = "EVENT:PASSWORD_MODE_DISPLAY";
            break;
        case FINGERPRINT_MODE_DISPLAY:
            eventMessage = "EVENT:FINGERPRINT_MODE_DISPLAY";
            break;
        case RFID_REGISTER:
            eventMessage = "EVENT:RFID_REGISTER";
            break;
        case FINGERPRINT_REGISTER:
            eventMessage = "EVENT:FINGERPRINT_REGISTER";
            break;
        case FINGERPRINT_REGISTER_MODE_DISPLAY:
            eventMessage = "EVENT:FINGERPRINT_REGISTER_MODE_DISPLAY";
            break;
        case RFID_REGISTER_MODE_DISPLAY: 
            eventMessage = "EVENT:RFID_REGISTER_MODE_DISPLAY";
            break;
        default:
            eventMessage = "EVENT:UNKNOWN";
            break;
    }
    send_data(payload, eventMessage);
}
