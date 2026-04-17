// components/csv-dropzone.tsx
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Shield } from "lucide-react";



export default function CsvDropzone({
  onFileLoaded,
  file = null,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const f = acceptedFiles[0];
      if (f && onFileLoaded) onFileLoaded(f);
    },
    [onFileLoaded]
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

  // ── File loaded state ───────────────────────────────────────────────────

  if (file) {
    const isJson = file.name?.toLowerCase().endsWith(".json");
    const sizeKb = (file.size / 1024).toFixed(1);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const displaySize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-[#caff3d]/30 bg-[#caff3d]/4 p-5"
      >
        <div className="flex items-center gap-4">
          {/* File type icon block */}
          <div className="flex items-stretch rounded-md overflow-hidden flex-shrink-0">
            <div className="bg-[#caff3d] w-10 h-10 flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-black" />
            </div>
            <div className="bg-black w-1" />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {file.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {displaySize}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {isJson ? "JSON" : "CSV"}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1 text-xs font-semibold text-[#caff3d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#caff3d]" />
                Ready
              </span>
            </div>
          </div>

          {/* Privacy note */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted border border-border flex-shrink-0">
            <Shield className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
              Processed locally
            </span>
          </div>

          {/* Remove button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileLoaded(null);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-muted-foreground border border-border bg-card
                       hover:bg-muted hover:text-foreground hover:border-border/80
                       transition-all duration-150 flex-shrink-0"
            aria-label="Remove file"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Drop zone ───────────────────────────────────────────────────────────

  return (
    <div
      {...getRootProps()}
      className={[
        "relative rounded-xl border-2 border-dashed cursor-pointer",
        "transition-all duration-200 overflow-hidden",
        isDragActive
          ? "border-[#caff3d] bg-[#caff3d]/5"
          : "border-border bg-card hover:border-black/30 hover:bg-muted/30",
      ].join(" ")}
    >
      <input {...getInputProps()} />

      {/* Animated corner accents when dragging */}
      <AnimatePresence>
        {isDragActive && (
          <>
            {/* Top-left */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#caff3d] rounded-tl-xl pointer-events-none"
            />
            {/* Top-right */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.04 }}
              className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#caff3d] rounded-tr-xl pointer-events-none"
            />
            {/* Bottom-left */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.08 }}
              className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#caff3d] rounded-bl-xl pointer-events-none"
            />
            {/* Bottom-right */}
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, delay: 0.12 }}
              className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#caff3d] rounded-br-xl pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-5 px-8 py-14 text-center">

        {/* Upload icon block */}
        <motion.div
          animate={isDragActive ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-stretch rounded-lg overflow-hidden"
        >
          <div
            className={`w-14 h-14 flex items-center justify-center transition-colors duration-200 ${
              isDragActive ? "bg-[#caff3d]" : "bg-muted"
            }`}
          >
            <Upload
              className={`w-6 h-6 transition-colors duration-200 ${
                isDragActive ? "text-black" : "text-muted-foreground"
              }`}
            />
          </div>
          <div
            className={`w-1 transition-colors duration-200 ${
              isDragActive ? "bg-black" : "bg-border"
            }`}
          />
        </motion.div>

        {/* Text */}
        <div className="space-y-1.5">
          <p className="font-semibold text-foreground text-base">
            {isDragActive
              ? "Release to upload"
              : "Drag & drop a file, or click to browse"}
          </p>
          <p className="text-sm text-muted-foreground">
            Supports{" "}
            <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
              .csv
            </code>{" "}
            and{" "}
            <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
              .json
            </code>{" "}
            · Up to 100,000 rows
          </p>
        </div>

        {/* Privacy pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border">
          <Shield className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-medium text-muted-foreground">
            Your data never leaves your browser
          </span>
        </div>

      </div>
    </div>
  );
}