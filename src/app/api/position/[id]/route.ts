import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/db/mongodb";
import { Position } from "@/models/position";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const data = await req.json();

  const { id } = await Promise.resolve(params);

  const updated = await Position.findByIdAndUpdate(id, data, {
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

  const position = await Position.findOne({ _id: id });
  if (!position) {
    return NextResponse.json(
      { message: "Chức vụ không tồn tại" },
      { status: 404 }
    );
  }

  await Position.deleteOne({ _id: id });

  return NextResponse.json({ message: "Deleted" });
}
