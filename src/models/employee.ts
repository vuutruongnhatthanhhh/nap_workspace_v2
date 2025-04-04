import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  id: String,
  name: String,
  position: String,
  department: String,
  avatar: String,
  gender: String,
  birthDate: String,
  phone: String,
  email: String,
  probationDate: String,
  officialDate: String,
  contractType: String,
  seniority: String,
  insurance: String,
  status: String,
});

export const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
