import mongoose, { Schema, Document } from 'mongoose';

interface HistoryModel extends Document<mongoose.Types.ObjectId> {
  userId: mongoose.Types.ObjectId;
  method: 'RFID' | 'Fingerprint' | 'Key';
  timeStamp: Date;
}

const historySchema = new Schema<HistoryModel>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  method: { type: String, enum: ["RFID", "Fingerprint", "Key"] },
  timeStamp: { type: Date, default: Date.now }
});

export const History = mongoose.model("History", historySchema);

