"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CompareFilesPage() {
  const [file1Content, setFile1Content] = useState<string>("");
  const [file2Content, setFile2Content] = useState<string>("");
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileContent: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const compareFiles = () => {
    if (file1Content && file2Content) {
      const isMatch = file1Content === file2Content;
      setComparisonResult(isMatch ? "Giống nhau" : "Khác nhau");
    } else {
      setComparisonResult("Vui lòng tải lên đủ 2 file.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#111827]">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        So sánh file 📂
      </h1>
      <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
        (Lưu ý hệ thống so sánh đến cả dấu cách)
      </p>

      <div className="space-y-4 mb-4">
        <div>
          <Label className="mb-4" htmlFor="file1">
            File 1
          </Label>
          <Input
            id="file1"
            type="file"
            onChange={(e) => handleFileChange(e, setFile1Content)}
          />
        </div>
        <div>
          <Label className="mb-4" htmlFor="file2">
            File 2
          </Label>
          <Input
            id="file2"
            type="file"
            onChange={(e) => handleFileChange(e, setFile2Content)}
          />
        </div>
      </div>

      <Button onClick={compareFiles}>So sánh</Button>

      {comparisonResult && (
        <div
          className={`mt-6 p-4 rounded text-center font-semibold text-lg ${
            comparisonResult === "Giống nhau"
              ? "bg-green-100 text-green-700"
              : comparisonResult === "Khác nhau"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {comparisonResult}
        </div>
      )}
    </div>
  );
}
