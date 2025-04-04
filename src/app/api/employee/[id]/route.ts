import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Employee } from "@/models/employee";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  await connectToDatabase();
  const updated = await Employee.findOneAndUpdate({ id: params.id }, data, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  await Employee.deleteOne({ id: params.id });
  return NextResponse.json({ message: "Deleted" });
}
