#include "utils/i2c_address_utils.h"

byte scan_i2c_address() {
    byte error, address;
    int nDevices = 0;
  
    Serial.println("Scanning I2C addresses...");
  
    for (address = 1; address < 127; address++) {
      Wire.beginTransmission(address);
      error = Wire.endTransmission();
  
      if (error == 0) {
        Serial.print("I2C device found at address 0x");
        if (address < 16) {
          Serial.print("0");
        }
        Serial.println(address, HEX);
        nDevices++;
        return address;
      }
    }
  
    if (nDevices == 0) {
      Serial.println("No I2C devices found");
    } else {
      Serial.println("done");
    }
    return 0;
}