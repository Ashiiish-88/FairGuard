"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";

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
      <Card className="p-6 bg-card/50 border-border/50 border-dashed">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isJson ? "bg-blue-500/10" : "bg-emerald-500/10"}`}>
            <FileText className={`w-6 h-6 ${isJson ? "text-blue-400" : "text-emerald-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • {isJson ? "JSON" : "CSV"}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onFileLoaded(null); }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Remove
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={`p-12 border-2 border-dashed cursor-pointer transition-all text-center
        ${isDragActive
          ? "border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/10"
          : "border-border/50 bg-card/30 hover:border-border hover:bg-card/50"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragActive ? "bg-purple-500/20" : "bg-muted/50"}`}>
          <Upload className={`w-8 h-8 ${isDragActive ? "text-purple-400" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="font-semibold text-lg">
            {isDragActive ? "Drop your file here" : "Drag & drop a CSV or JSON file, or click to browse"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Supports CSV and JSON (array of objects) • Up to 100,000 rows • Your data stays in your browser</p>
        </div>
      </div>
    </Card>
  );
}
