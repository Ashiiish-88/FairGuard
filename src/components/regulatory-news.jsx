"use client";

import { motion } from "framer-motion";
import { Globe, ExternalLink, Newspaper, Calendar, Scale, Sparkles, Search } from "lucide-react";

export default function RegulatoryNews({ news, loading }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <Globe className="w-4 h-4 text-foreground animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Fetching Regulatory News</p>
            <p className="text-xs text-muted-foreground">Searching with Gemini Google Search Grounding…</p>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
            <span className="text-sm">Searching for latest AI regulation news…</span>
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
          <p className="text-sm font-semibold text-foreground">Latest AI Regulation News</p>
          <p className="text-xs text-muted-foreground">
            Powered by Gemini with Google Search Grounding
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {news.grounded && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0057ff]/10 text-[#0057ff]">
              <Search className="w-2.5 h-2.5" />
              Search Grounded
            </span>
          )}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#caff3d]/15 text-[#a3cc2e]">
            <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
            Live
          </span>
        </div>
      </div>

      {/* Summary */}
      {news.summary && (
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-xs text-muted-foreground leading-relaxed">{news.summary}</p>
        </div>
      )}

      {/* News Items */}
      {news.news?.length > 0 && (
        <div className="divide-y divide-border">
          {news.news.slice(0, 5).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {item.headline}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {item.source && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <ExternalLink className="w-2.5 h-2.5" />
                        {item.source}
                      </span>
                    )}
                    {item.date && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.date}
                      </span>
                    )}
                    {item.regulation && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        {item.regulation}
                      </span>
                    )}
                  </div>
                  {item.relevance && (
                    <p className="text-[11px] text-[#0057ff] mt-1.5 italic">
                      💡 {item.relevance}
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
