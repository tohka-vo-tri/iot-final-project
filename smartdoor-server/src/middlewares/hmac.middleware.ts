import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

const secretKey = process.env.HMAC_SECRET_KEY!;

export const hmacMiddleware = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    const clientSignature = req.header('x-hmac-signature');
    if (!clientSignature) {
      res.status(401).json({ error: 'HMAC signature missing' });
    }
    const payload = JSON.stringify(req.body);
    if (!payload || !clientSignature || !secretKey) {
      res.status(400).json({ error: 'Payload, client signature, and secret key are required' });
      return;
    }

    // Tạo HMAC signature trên server
    const serverSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    // Chuyển đổi chữ ký thành buffer để so sánh an toàn
    const serverBuffer = Buffer.from(serverSignature, 'hex');
    const clientBuffer = Buffer.from(clientSignature, 'hex');

    // Kiểm tra độ dài trước để tránh timing attack
    if (serverBuffer.length !== clientBuffer.length) {
      res.status(403).json({ error: 'Invalid HMAC signature' });
      return;
    }

    // So sánh an toàn bằng timingSafeEqual
    if (!crypto.timingSafeEqual(serverBuffer, clientBuffer)) {
      res.status(403).json({ error: 'Invalid HMAC signature' });
      return;
    }

    // Nếu chữ ký hợp lệ, tiếp tục xử lý (đoạn code tiếp theo của bạn)
    res.status(200).json({ message: 'Signature verified successfully' });
    if (clientSignature !== serverSignature) {
      res.status(403).json({ error: 'Invalid HMAC signature' });
    }
    next();
  };
