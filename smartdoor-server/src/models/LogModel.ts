import mongoose, { Schema, Document } from 'mongoose';
const moment = require('moment-timezone');

interface LogModel extends Document<mongoose.Types.ObjectId> {
  roomId: mongoose.Types.ObjectId;
  nameRoom: string;
  deviceId: string;
  nameDevice: string;
  nameUser: string;
  action: 'open' | 'close' | 'sign_password';
  timeStamp: Date;
}

const logSchema = new Schema<LogModel>({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  nameRoom: { type: String, required: true },
  deviceId: { type: String, required: true},
  nameDevice: { type: String, required: true },
  nameUser: { type: String, required: true },
  action: { type: String, enum: ['open', 'update_password', 'update_fingerprint', 'update_rfid'], required: true },
  timeStamp: { type: Date, default: () => moment().tz('Asia/Ho_Chi_Minh').toDate() }
});

export const Log = mongoose.model<LogModel>('Log', logSchema);
