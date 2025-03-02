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
    const serverSignature = crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');
    if (clientSignature !== serverSignature) {
      res.status(403).json({ error: 'Invalid HMAC signature' });
    }
    next();
  };
