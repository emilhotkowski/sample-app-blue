import { Document, Schema, model } from 'mongoose';

export enum UserRole {
  nurse = 'nurse',
  patient = 'patient'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  password: string;
  role: UserRole;
}

// We can create polymorphic schema for Nurses
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.patient,
    required: true
  },
  // Credentials
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = model<IUser>("users", UserSchema);
