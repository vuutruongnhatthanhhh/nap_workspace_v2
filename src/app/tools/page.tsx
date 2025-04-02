"use client";
import React, { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function FileCompressorPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [folderFiles, setFolderFiles] = useState<FileList | null>(null);
  const [isCompressingFile, setIsCompressingFile] = useState(false);
  const [isCompressingFolder, setIsCompressingFolder] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [folderProgress, setFolderProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderFiles(event.target.files);
  };

  const handleCompressFiles = async () => {
    if (!files) return;
    setIsCompressingFile(true);
    setFileProgress(0);

    const zip = new JSZip();
    Array.from(files).forEach((file) => {
      zip.file(file.name, file);
    });

    const content = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      },
      (metadata) => {
        setFileProgress(Math.round(metadata.percent));
      }
    );

    saveAs(content, "compressed_files.zip");
    setIsCompressingFile(false);
    setFiles(null); // clear files after compressing
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const handleCompressFolder = async () => {
    if (!folderFiles) return;
    setIsCompressingFolder(true);
    setFolderProgress(0);

    const zip = new JSZip();
    Array.from(folderFiles).forEach((file) => {
      const path = (file as any).webkitRelativePath || file.name;
      zip.file(path, file);
    });

    const content = await zip.generateAsync(
      {
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 },
      },
      (metadata) => {
        setFolderProgress(Math.round(metadata.percent));
      }
    );

    saveAs(content, "compressed_folder.zip");
    setIsCompressingFolder(false);
    setFolderFiles(null); // clear folder files after compressing
    folderInputRef.current && (folderInputRef.current.value = "");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Nén file và thư mục 📦
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 text-center">
        (Nhấn giữ Ctrl để chọn nhiều file)
      </p>

      <div className="space-y-8">
        {/* File */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-black dark:text-white">
            Nén File
          </h2>
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          {files?.length && (
            <div className="space-y-2">
              <Button
                onClick={handleCompressFiles}
                disabled={isCompressingFile}
              >
                {isCompressingFile ? "Đang nén..." : "Nén File"}
              </Button>
              {isCompressingFile && (
                <Progress value={fileProgress} className="h-2" />
              )}
            </div>
          )}
        </div>

        {/*Folder */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-black dark:text-white">
            Nén Thư Mục
          </h2>
          <Input
            type="file"
            multiple
            ref={folderInputRef}
            onChange={handleFolderChange}
            {...({
              webkitdirectory: "true",
            } as React.HTMLAttributes<HTMLInputElement>)}
          />
          {folderFiles?.length && (
            <div className="space-y-2">
              <Button
                onClick={handleCompressFolder}
                disabled={isCompressingFolder}
              >
                {isCompressingFolder ? "Đang nén..." : "Nén Thư Mục"}
              </Button>
              {isCompressingFolder && (
                <Progress value={folderProgress} className="h-2" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
