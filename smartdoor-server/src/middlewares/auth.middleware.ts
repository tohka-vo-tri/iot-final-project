import { User } from '@/models/UserModel';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type TUserPayload = {
    userId: string;
    email: string;
};

export interface AuthenticatedRequest extends Request {
    user?: TUserPayload;
}

const SECRET_KEY = process.env.JWT_SECRET!;

export const authMiddleware = async(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Authorization token missing' });
        return;
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as {userId: string};
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({message: 'User not found'});
            return;
        } 
        req.user = {
            userId: decoded.userId,
            email: user.email
        };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};