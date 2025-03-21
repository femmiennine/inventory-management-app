import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  token?: string;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (value: string) {
        // Check for at least one uppercase, one lowercase, and one number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
      },
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
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
