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
      res.status(401).json({ message: 'HMAC signature missing' });
    }
    const payload = JSON.stringify(req.body);
    if (!payload || !clientSignature || !secretKey) {
      res.status(400).json({ message: 'Payload, client signature, and secret key are required' });
      return;
    }

    const serverSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');

    const serverBuffer = Buffer.from(serverSignature, 'hex');
    const clientBuffer = Buffer.from(clientSignature, 'hex');

    if (serverBuffer.length !== clientBuffer.length) {
      res.status(403).json({ message: 'Invalid HMAC signature' });
      return;
    }

    if (!crypto.timingSafeEqual(serverBuffer, clientBuffer)) {
      res.status(403).json({ message: 'Invalid HMAC signature' });
      return;
    }
    if (clientSignature !== serverSignature) {
      res.status(403).json({ message: 'Invalid HMAC signature' });
    }
    next();
  };
