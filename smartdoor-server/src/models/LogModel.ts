import mongoose, { Schema, Document } from 'mongoose';

interface LogModel extends Document<mongoose.Types.ObjectId> {
  deviceId: mongoose.Types.ObjectId;
  action: 'open' | 'close' | 'sign_password';
  timeStamp: Date;
}

const logSchema = new Schema<LogModel>({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, enum: ['open', 'update_password', 'update_fingerprint', 'update_rfid'], required: true },
  timeStamp: { type: Date, default: Date.now }
});

export const Log = mongoose.model<LogModel>('Log', logSchema);
