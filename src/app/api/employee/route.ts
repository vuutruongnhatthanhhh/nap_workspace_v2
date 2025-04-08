import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Employee } from "@/models/employee";

export async function GET() {
  try {
    await connectToDatabase();
    const employees = await Employee.find();
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Lỗi khi fetch danh sách nhân sự:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách nhân sự" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const created = await Employee.create(data);
    return NextResponse.json(created);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
