#include "events/event_emitter.h"

std::map<String, EventCallback> eventHandlers;

void on_event(const String& eventName, EventCallback callback) {
    eventHandlers[eventName] = callback;
}

void emit_event(const String& eventCommand) {
    if (eventCommand.startsWith("EVENT:")) {
        int firstColon = eventCommand.indexOf(':', 6);
        String eventName = eventCommand.substring(6, firstColon);
        String payload = eventCommand.substring(firstColon + 1);

        if (eventHandlers.count(eventName)) {
            eventHandlers[eventName](payload);
        } else {
            Serial.println("No handler for event: " + eventName);
        }
    }
}
