import { mkdir, unlinkSync } from "fs";
import path from "path";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const mongoId = formData.get("_id") as string;

  if (!file || !mongoId) {
    return NextResponse.json(
      { message: "Thiếu file hoặc _id nhân sự" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "upload-avt");

  // create folder if not exists
  await new Promise<void>((resolve, reject) => {
    mkdir(uploadDir, { recursive: true }, (err) =>
      err ? reject(err) : resolve()
    );
  });

  // delete old image
  //   const existingFiles = await fg(`${uploadDir}/${mongoId}.*`);
  //   existingFiles.forEach((f) => unlinkSync(f));

  // use .webp
  const fileName = `${mongoId}.webp`;
  const filePath = path.join(uploadDir, fileName);

  await sharp(buffer).webp({ quality: 80 }).toFile(filePath);

  const fileUrl = `/upload-avt/${fileName}`;
  return NextResponse.json({ url: fileUrl }, { status: 200 });
}
