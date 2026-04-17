"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function CsvDropzone({ onFileLoaded, file }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) onFileLoaded(f);
  }, [onFileLoaded]);

  const handleChange = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) onFileLoaded(f);
  }, [onFileLoaded]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
        dragActive
          ? "border-[#caff3d] bg-gray-50/20"
          : file
            ? "border-[#04cfff] bg-[#CCFBF1]/10"
            : "border-[#D1D5DB] bg-white hover:border-[#64748b] hover:bg-white"
      }`}
    >
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {file ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-[#04cfff]/10 flex items-center justify-center rounded-xl">
            <FileText className="w-7 h-7 text-[#04cfff]" />
          </div>
          <div>
            <p className="font-semibold text-[#000000]">{file.name}</p>
            <p className="text-sm text-[#9CA3AF] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onFileLoaded(null); }}
            className="text-xs text-[#9CA3AF] hover:text-[#ff6b7a] flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-[#F3F4F6] flex items-center justify-center rounded-xl">
            <Upload className="w-7 h-7 text-[#9CA3AF]" />
          </div>
          <div>
            <p className="font-semibold text-[#000000]">Drop your CSV or JSON file here</p>
            <p className="text-sm text-[#9CA3AF] mt-1">or click to browse</p>
          </div>
        </div>
      )}
    </div>
  );
}
