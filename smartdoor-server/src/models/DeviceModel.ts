import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type AuthMethod = 'Password' | 'RFID' | 'Fingerprint';

export interface AuthData {
    method: AuthMethod;
    data: string;
    name: string;
    createdAt: Date;
}

export interface DeviceModel extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    authData: AuthData[];
    createdAt: Date;
}

const authDataSchema = new Schema<AuthData>({
    method: { type: String, enum: ['Password', 'RFID', 'Fingerprint'], required: true },
    data: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const deviceSchema = new Schema<DeviceModel>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    authData: [authDataSchema],
    createdAt: { type: Date, default: Date.now },
});

deviceSchema.pre('save', async function (next) {
    for (const auth of this.authData) {
        if (auth.method === 'Password' && auth.data && !auth.data.startsWith('$2a$')) {
            auth.data = await bcrypt.hash(auth.data, 10);
        }
    }
    next();
});

export const Device = mongoose.model<DeviceModel>('Device', deviceSchema);
