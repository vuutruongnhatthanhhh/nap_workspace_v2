import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Position } from "@/models/position";

export async function GET() {
  try {
    await connectToDatabase();
    const positions = await Position.find();
    return NextResponse.json(positions);
  } catch (error) {
    console.error("Lỗi khi fetch danh sách chức vụ:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách chức vụ" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const created = await Position.create(data);
    return NextResponse.json(created);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
