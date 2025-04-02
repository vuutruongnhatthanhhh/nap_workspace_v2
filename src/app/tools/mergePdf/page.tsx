"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MergePdfPage() {
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [order, setOrder] = useState<string>("0-1");
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergedPdfBlob, setMergedPdfBlob] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length === 2) {
      setPdfFiles([files[0], files[1]]);
    } else {
      alert("Vui lòng chọn đúng 2 file PDF");
    }
  };

  const mergePDFs = async () => {
    if (pdfFiles.length !== 2) return alert("Cần đúng 2 file PDF");

    const pdfDoc = await PDFDocument.create();
    const [firstIndex, secondIndex] = order.split("-").map(Number);
    const [file1, file2] = [pdfFiles[firstIndex], pdfFiles[secondIndex]];

    const [pdfBytes1, pdfBytes2] = await Promise.all([
      file1.arrayBuffer(),
      file2.arrayBuffer(),
    ]);

    const pdf1 = await PDFDocument.load(pdfBytes1);
    const pdf2 = await PDFDocument.load(pdfBytes2);

    const pages1 = await pdfDoc.copyPages(pdf1, pdf1.getPageIndices());
    const pages2 = await pdfDoc.copyPages(pdf2, pdf2.getPageIndices());

    [...pages1, ...pages2].forEach((page) => pdfDoc.addPage(page));

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setMergedPdfUrl(url);
    setMergedPdfBlob(blob);
  };

  return (
    <div className="max-w-2xl mx-auto mb-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-black dark:text-white">
        Gộp file PDF 📎
      </h1>
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
        (Nhấn giữ Ctrl để chọn 2 file PDF)
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <Label className="mb-4" htmlFor="upload">
            Chọn 2 file PDF
          </Label>
          <Input
            id="upload"
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {pdfFiles.length === 2 && (
          <div>
            <Label className="mb-4">Thứ tự gộp</Label>
            <Select value={order} onValueChange={(value) => setOrder(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">
                  <span className="text-red-500">{pdfFiles[0].name}</span>{" "}
                  trước,{" "}
                  <span className="text-red-500">{pdfFiles[1].name}</span> sau
                </SelectItem>
                <SelectItem value="1-0">
                  <span className="text-red-500">{pdfFiles[1].name}</span>{" "}
                  trước,{" "}
                  <span className="text-red-500">{pdfFiles[0].name}</span> sau
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={mergePDFs} disabled={pdfFiles.length !== 2}>
          Gộp PDF
        </Button>
      </div>

      {mergedPdfUrl && (
        <>
          <div className="border rounded overflow-hidden w-full h-[600px] mb-4">
            <object
              data={mergedPdfUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          </div>
          <div className="text-center">
            <Button asChild>
              <a
                href={URL.createObjectURL(mergedPdfBlob!)}
                download="merged.pdf"
              >
                Tải xuống PDF
              </a>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
