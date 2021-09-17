import { Model, Schema } from "mongoose";
import { IUser, User } from "./user.model";

export interface IMedicalRecord {
  illness: string
  // could be much more data
}

export interface IPatient extends IUser {
  medicalHistory: IMedicalRecord[]
}

const options = { discriminatorKey: 'type' };

const MedicalRecordSchema = new Schema({
  illness: {
    type: String,
    required: true
  },
});

// We can create polymorphic schema for Nurses
export const Patient: Model<IPatient> = User.discriminator("patient", new Schema({
  medicalHistory: [MedicalRecordSchema]
}, options));

