import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Employee } from "@/models/employee";

export async function GET() {
  await connectToDatabase();
  const employees = await Employee.find();
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Dữ liệu nhận từ FE:", data);

    await connectToDatabase();
    const created = await Employee.create(data);

    console.log("✅ Đã tạo thành công:", created);
    return NextResponse.json(created);
  } catch (error) {
    console.error("❌ Lỗi ở backend:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
