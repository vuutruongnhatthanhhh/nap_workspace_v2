"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function WatermarkImagePage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setWatermarkedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAddWatermark = () => {
    if (!imageSrc || !watermarkText) return;

    const img = new window.Image();

    img.src = imageSrc;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      ctx.font = "30px Arial";
      ctx.fillStyle = "rgba(128, 128, 128, 0.7)";
      ctx.textAlign = "center";
      ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 30);

      const dataURL = canvas.toDataURL("image/png");
      setWatermarkedImage(dataURL);
    };
  };

  const handleDownload = () => {
    if (!watermarkedImage) return;
    const link = document.createElement("a");
    link.href = watermarkedImage;
    link.download = "image-with-watermark.png";
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-10 text-center text-black dark:text-white">
        Thêm Watermark vào hình ảnh 🖼️
      </h1>

      <div className="space-y-4 mb-6">
        <div>
          <Label className="mb-4" htmlFor="watermark">
            Nội dung Watermark
          </Label>
          <Input
            id="watermark"
            type="text"
            placeholder="Nhập nội dung watermark"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-4" htmlFor="upload">
            Chọn hình ảnh
          </Label>
          <Input
            id="upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <Button
          onClick={handleAddWatermark}
          disabled={!imageSrc || !watermarkText}
        >
          Thêm Watermark
        </Button>
      </div>

      {imageSrc && !watermarkedImage && (
        <div className="mb-6">
          <Image
            src={imageSrc}
            alt="Original"
            width={500}
            height={500}
            className="mx-auto rounded shadow"
          />
        </div>
      )}

      {watermarkedImage && (
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={watermarkedImage}
            alt="With Watermark"
            width={500}
            height={500}
            className="rounded shadow"
          />
          <Button onClick={handleDownload} className="w-fit">
            Tải ảnh về
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
