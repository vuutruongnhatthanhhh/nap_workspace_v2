"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export default function WatermarkPdfPage() {
  const [pdfFile, setPdfFile] = useState<ArrayBuffer | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [watermarkedPdf, setWatermarkedPdf] = useState<Uint8Array | null>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPdfFile(reader.result as ArrayBuffer);
      setWatermarkedPdf(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const addWatermarkToPdf = async () => {
    if (!pdfFile || !watermarkText) return;

    const pdfDoc = await PDFDocument.load(pdfFile);
    const pages = pdfDoc.getPages();

    pages.forEach((page, index) => {
      if (index === 0) return; // Bỏ qua trang đầu tiên
      const { width, height } = page.getSize();
      const fontSize = 30;
      const watermarkWidth = watermarkText.length * fontSize * 0.6;
      const watermarkHeight = fontSize;
      const x = (width - watermarkWidth) / 2;
      const y = (height - watermarkHeight) / 2;

      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        color: rgb(0.95, 0.95, 0.95),
        rotate: degrees(45),
      });
    });

    const pdfBytes = await pdfDoc.save();
    setWatermarkedPdf(pdfBytes);
  };

  const downloadPdf = () => {
    if (!watermarkedPdf) return;
    const blob = new Blob([watermarkedPdf], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pdf-with-watermark.pdf";
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Thêm Watermark vào PDF 📄
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
            Tải lên PDF
          </Label>
          <Input
            id="upload"
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
          />
        </div>
        <Button
          onClick={addWatermarkToPdf}
          disabled={!pdfFile || !watermarkText}
        >
          Thêm Watermark
        </Button>
      </div>

      {watermarkedPdf && (
        <div className="flex justify-center">
          <Button onClick={downloadPdf}>Tải về PDF có Watermark</Button>
        </div>
      )}
    </div>
  );
}
