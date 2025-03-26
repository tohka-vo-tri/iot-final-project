#ifndef LED_CONFIG_H
#define LED_CONFIG_H

// Định nghĩa các chân LED
#define LED_GREEN 2   // Chân GPIO 2 cho LED xanh
#define LED_RED 15    // Chân GPIO 15 cho LED đỏ

// Hàm khởi tạo LED (có thể gọi trong setup())
inline void init_leds() {
    pinMode(LED_GREEN, OUTPUT);
    pinMode(LED_RED, OUTPUT);
    digitalWrite(LED_GREEN, LOW);  // Tắt LED xanh ban đầu
    digitalWrite(LED_RED, LOW);    // Tắt LED đỏ ban đầu
}

#endif // LED_CONFIG_H