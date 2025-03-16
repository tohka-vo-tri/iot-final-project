#include "utils/fingerprint_utils.h"
#include <Adafruit_Fingerprint.h>
#include "events/input_mode.h"
#include "utils/lcd_utils.h"
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

uint8_t registerID = 0;
int enrollStep = 0;

void init_fingerprint_sensor()
{
    mySerial.begin(57600, SERIAL_8N1, FINGERPRINT_RX, FINGERPRINT_TX);
    finger.begin(57600);

    if (finger.verifyPassword())
    {
        Serial.println("✅ Fingerprint sensor initialized successfully!");
    }
    else
    {
        Serial.println("❌ Failed to initialize fingerprint sensor!");
        while (1)
            ;
    }

    // Serial.println("Deleting all stored fingerprints...");
    // if (finger.emptyDatabase() == FINGERPRINT_OK)
    // {
    //     Serial.println("All fingerprints have been deleted successfully!");
    // }
    // else
    // {
    //     Serial.println("Error deleting fingerprints!");
    // }
}

uint8_t get_next_available_id()
{
    for (uint8_t id = 1; id < 127; id++)
    {
        if (finger.loadModel(id) != FINGERPRINT_OK)
        {
            return id;
        }
    }
    return 0;
}

void enroll_fingerprint() {
    if (registerID == 0) {
        registerID = get_next_available_id();
        if (registerID == 0) {
            Serial.println("❌ No available ID slots for fingerprint registration!");
            isRegisterMode = false;
            return;
        }
        Serial.print("🔍 Assigned ID: ");
        Serial.println(registerID);
    }

    // Yêu cầu người dùng đặt ngón tay lần 1
    Serial.println("🟢 Place your finger flat on the sensor...");
    while (finger.getImage() != FINGERPRINT_OK) {
        delay(100); // Chờ người dùng đặt ngón tay
    }
    Serial.println("✅ Finger detected.");

    if (finger.image2Tz(1) != FINGERPRINT_OK) {
        Serial.println("❌ Failed to process fingerprint! Please try again.");
        registerID = 0; // Reset ID nếu thất bại
        return;
    }
    Serial.println("✅ Fingerprint image converted.");

    // Yêu cầu người dùng tháo ngón tay
    Serial.println("🔄 Remove your finger and place it again from a different angle...");
    while (finger.getImage() != FINGERPRINT_NOFINGER) {
        delay(100); // Chờ người dùng tháo ngón tay
    }

    // Yêu cầu người dùng đặt ngón tay lần 2
    Serial.println("🟢 Place the same finger on the sensor at a slightly different angle...");
    while (finger.getImage() != FINGERPRINT_OK) {
        delay(100); // Chờ người dùng đặt ngón tay lại
    }
    Serial.println("✅ Finger detected again.");

    if (finger.image2Tz(2) != FINGERPRINT_OK) {
        Serial.println("❌ Failed to process the second fingerprint image! Please try again.");
        registerID = 0; // Reset ID nếu thất bại
        return;
    }
    Serial.println("✅ Second fingerprint image converted.");

    // Tạo mẫu vân tay
    if (finger.createModel() != FINGERPRINT_OK) {
        Serial.println("❌ Failed to create fingerprint model! Please try again.");
        registerID = 0; // Reset ID nếu thất bại
        return;
    }

    // Kiểm tra xem mẫu vân tay này có khớp với bất kỳ mẫu nào đã lưu trữ hay không
    Serial.println("🔍 Checking if this fingerprint already exists in the database...");
    if (finger.fingerFastSearch() == FINGERPRINT_OK) {
        Serial.print("❌ Fingerprint already exists with ID: ");
        Serial.println(finger.fingerID);
        clear_display();
        print_to_lcd(0, "Finger Exists");
        print_to_lcd(1, "Try Another Finger");
        delay(2000);
        registerID = 0; // Reset ID nếu trùng
        return;
    }

    // Nếu không tìm thấy mẫu trùng, tiến hành lưu trữ
    if (finger.storeModel(registerID) == FINGERPRINT_OK) {
        Serial.print("🎉 Fingerprint stored successfully with ID: ");
        Serial.println(registerID);
    } else {
        Serial.println("❌ Failed to store fingerprint! Please try again.");
        registerID = 0; // Reset ID nếu lưu thất bại
        return;
    }

    enrollStep = 0; 
    isRegisterMode = false; 
}
int get_fingerprint()
{
    int result = finger.getImage();
    if (result == FINGERPRINT_NOFINGER)
    {
        return -2; // Không có ngón tay, thoát
    }
    if (result != FINGERPRINT_OK)
    {
        Serial.println("⚠️ Fingerprint image capture failed. Please ensure proper finger placement.");
        return -1; // Lỗi khi đọc hình ảnh
    }

    result = finger.image2Tz(1);
    if (result != FINGERPRINT_OK)
    {
        Serial.println("⚠️ Fingerprint image conversion failed. Please try again.");
        return -1; // Lỗi chuyển đổi hình ảnh
    }

    result = finger.fingerFastSearch();
    if (result == FINGERPRINT_OK) {
        Serial.print("🔍 Fingerprint found with ID: ");
        Serial.println(finger.fingerID);
        return finger.fingerID; // Trả về ID của vân tay đã đăng ký
    } else {
        Serial.println("🔍 No matching fingerprint found.");
        return 0; // Không tìm thấy vân tay
    }
}
