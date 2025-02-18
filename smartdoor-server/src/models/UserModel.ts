import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { timeStamp } from 'console';


interface UserModel extends Document<mongoose.Types.ObjectId> {
  name: string;
  email: string;
  password: string;
  rfid: string;
  fingerprintId: number;
  createAt: Date;
  dateCreateRfid?:Date;
  dateCreateFingerprint?:Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const historySchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
  method: {type: String, enum: ["RFID", "Fingerprint","Key"]},
  timeStamp: {type: Date,default: Date.now}
})
const userSchema = new Schema<UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rfid: { type: String, unique: true, sparse: true },
  fingerprintId: {type: Number,unique: true, spare: true},
  createAt: {type: Date, default: Date.now},
  dateCreateRfid: {type: Date, default: Date.now},
  dateCreateFingerprint: {type: Date, default: Date.now},
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
export const History = mongoose.model("History", historySchema);
