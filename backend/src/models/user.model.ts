import mongoose, { Document } from 'mongoose';

export interface UserInterface extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  token?: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  token: String,
});

export default mongoose.model<UserInterface>('User', userSchema);
