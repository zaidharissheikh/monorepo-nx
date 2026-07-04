import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  emailHash?: string;
  password?: string;
  role: 'admin' | 'customer';
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailHash: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  },
  { timestamps: true }
);

// Method to check password match
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password and email
userSchema.pre('save', async function () {
  if (this.isModified('email') && this.email) {
    this.emailHash = require('crypto').createHash('sha256').update(this.email.toLowerCase()).digest('hex');
  }

  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

import { fieldEncryption } from 'mongoose-field-encryption';

userSchema.plugin(fieldEncryption, {
  fields: ['name', 'email'],
  secret: process.env.ENCRYPTION_KEY || 'default_secret_key_for_development_only_123',
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
