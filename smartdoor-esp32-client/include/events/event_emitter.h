#ifndef EVENT_EMITTER_H
#define EVENT_EMITTER_H

#include <Arduino.h>
#include <functional>
#include <map>

typedef std::function<void(const String&)> EventCallback;

void on_event(const String& eventName, EventCallback callback);
void emit_event(const String& eventCommand);

#endif