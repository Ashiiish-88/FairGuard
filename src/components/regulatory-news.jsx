"use client";

import { motion } from "framer-motion";
import { ExternalLink, Newspaper, Calendar, Scale, Database } from "lucide-react";

export default function RegulatoryNews({ news, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <Scale className="w-4 h-4 text-foreground animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Loading Applicable Regulations</p>
            <p className="text-xs text-muted-foreground">Checking FairGuard regulation database…</p>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-sm">Fetching compliance requirements…</span>
          </div>
        </div>
      </div>
    );
  }

  if (!news || (!news.news?.length && !news.summary)) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Applicable Regulations</p>
          <p className="text-xs text-muted-foreground">FairGuard Regulation Database · Citable legal sources</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#caff3d]/10 text-black border border-[#caff3d]/20">
            <Database className="w-2.5 h-2.5" />
            Offline DB
          </span>
        </div>
      </div>

      {/* Summary */}
      {news.summary && (
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-xs text-muted-foreground leading-relaxed">{news.summary}</p>
        </div>
      )}

      {/* Regulation Items */}
      {news.news?.length > 0 && (
        <div className="divide-y divide-border">
          {news.news.slice(0, 6).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="px-6 py-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0057ff]/8 border border-[#0057ff]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scale className="w-4 h-4 text-[#0057ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    {item.headline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {item.source && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {item.source}
                      </span>
                    )}
                    {item.date && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.date}
                      </span>
                    )}
                    {(item.url || item.source_url) && (
                      <a
                        href={item.url || item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#0057ff] hover:underline"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        Official source
                      </a>
                    )}
                  </div>
                  {item.relevance && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 italic border-l-2 border-[#0057ff]/20 pl-2">
                      {item.relevance}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
