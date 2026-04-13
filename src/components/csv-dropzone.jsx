"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileText } from "lucide-react";

export default function CsvDropzone({ onFileAccepted, file, onRemove }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0 && onFileAccepted) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

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
    return (
      <div className="flex items-center justify-between gap-3 px-5 py-4 border border-[#E5E7EB] bg-[#F9FAFB] rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#0D9488]" />
          <div>
            <p className="text-sm font-semibold text-[#0A0A0A]">{file.name}</p>
            <p className="text-xs text-[#6B7280]">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="p-1.5 rounded-md hover:bg-[#FEE2E2] text-[#6B7280] hover:text-[#EF4444] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed px-8 py-14 text-center transition-all duration-200 ${
        isDragActive
          ? "border-[#F59E0B] bg-[#FEF3C7]/50"
          : "border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#F59E0B]/50 hover:bg-[#FEF3C7]/20"
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragActive ? "text-[#D97706]" : "text-[#9CA3AF]"}`} />
      <p className="text-sm font-semibold text-[#0A0A0A] mb-1">
        Drag & drop a CSV or JSON file, or click to browse
      </p>
      <p className="text-xs text-[#6B7280]">
        Supports CSV and JSON (array of objects) &bull; Up to 100,000 rows &bull; Your data stays in your browser
      </p>
    </div>
  );
}
