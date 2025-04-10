import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Employee } from "@/models/employee";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const data = await req.json();

  const { id } = await Promise.resolve(params);

  const updated = await Employee.findByIdAndUpdate(id, data, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = await Promise.resolve(params);

  const employee = await Employee.findOne({ _id: id });
  if (!employee) {
    return NextResponse.json(
      { message: "Nhân sự không tồn tại" },
      { status: 404 }
    );
  }

  await Employee.deleteOne({ _id: id });

  if (employee.avatar && !employee.avatar.includes("avatar-user.jpg")) {
    const avatarPathNoQuery = employee.avatar.split("?")[0];
    const avatarPath = path.join(process.cwd(), "public", avatarPathNoQuery);
    try {
      await unlink(avatarPath);
    } catch (error) {
      console.error("Lỗi khi xóa file ảnh:", error);
    }
  }

  return NextResponse.json({ message: "Deleted" });
}
