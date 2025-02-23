import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

interface UserModel extends Document<mongoose.Types.ObjectId> {
  name: string;
  email: string;
  password: string;
  createAt: Date;
  devices: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }]
});


userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model<UserModel>('User', userSchema);