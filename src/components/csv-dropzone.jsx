"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";

export default function CsvDropzone({ onFileLoaded, file = null }) {
  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f && onFileLoaded) onFileLoaded(f);
  }, [onFileLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
    maxFiles: 1,
    multiple: false,
  });

  if (file) {
    const isJson = file.name?.endsWith(".json");
    return (
      <Card className="p-6 bg-white border-[#E2E6ED] border-dashed">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex items-center justify-center ${isJson ? "bg-[#007AFF]/10" : "bg-[#00C853]/10"}`} style={{ borderRadius: '10px' }}>
            <FileText className={`w-6 h-6 ${isJson ? "text-[#007AFF]" : "text-[#00C853]"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0A1628] truncate">{file.name}</p>
            <p className="text-sm text-[#5A6A85]">{(file.size / 1024).toFixed(1)} KB • {isJson ? "JSON" : "CSV"}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onFileLoaded(null); }}
            className="w-8 h-8 flex items-center justify-center text-[#5A6A85] hover:text-[#FF2D55] hover:bg-[#FF2D55]/5 transition-all"
            style={{ borderRadius: '6px' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={`p-12 border-2 border-dashed cursor-pointer transition-all duration-200 text-center
        ${isDragActive
          ? "border-[#00C853] bg-[#00C853]/5 shadow-lg shadow-[#00C853]/10"
          : "border-[#E2E6ED] bg-[#F5F7FA]/50 hover:border-[#00C853]/40 hover:bg-[#00C853]/3"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 flex items-center justify-center transition-colors ${isDragActive ? "bg-[#00C853]/15" : "bg-[#F0F2F5]"}`} style={{ borderRadius: '14px' }}>
          <Upload className={`w-8 h-8 ${isDragActive ? "text-[#00C853]" : "text-[#5A6A85]"}`} />
        </div>
        <div>
          <p className="font-semibold text-lg text-[#0A1628]">
            {isDragActive ? "Drop your file here" : "Drag & drop a CSV or JSON file, or click to browse"}
          </p>
          <p className="text-sm text-[#5A6A85] mt-1">Supports CSV and JSON (array of objects) • Up to 100,000 rows • Your data stays in your browser</p>
        </div>
      </div>
    </Card>
  );
}
