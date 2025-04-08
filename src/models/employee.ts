import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IEmployee extends Document {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  gender: string;
  birthDate: Date;
  phone: string;
  email: string;
  probationDate: Date;
  officialDate: Date;
  contractType: string;
  seniority: string;
  insurance: string;
  status: string;
  password: string;
  role: "admin" | "user";
  permissions: string[];
}

const EmployeeSchema: Schema = new Schema<IEmployee>({
  id: { type: String },
  name: { type: String, required: true },
  position: { type: String },
  department: { type: String },
  avatar: { type: String },
  gender: { type: String, required: true },
  birthDate: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true },
  probationDate: { type: Date },
  officialDate: { type: Date },
  contractType: { type: String },
  seniority: { type: String },
  insurance: { type: String },
  status: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  permissions: [{ type: String }],
});

export const Employee =
  models.Employee || model<IEmployee>("Employee", EmployeeSchema);
