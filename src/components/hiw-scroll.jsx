"use client";
import { useEffect } from "react";

export default function HiwScroll() {
  useEffect(() => {
    const steps = Array.from(document.querySelectorAll(".hiw-step"));
    const panels = Array.from(document.querySelectorAll(".hiw-image"));
    const rightCol = document.getElementById("hiw-right-col");

    if (!steps.length || !panels.length || !rightCol) return;

    // ── 1. Sync right col height to left col so sticky has room to scroll ──
    const leftCol = rightCol.previousElementSibling;
    const syncHeight = () => {
      if (leftCol) rightCol.style.height = leftCol.offsetHeight + "px";
    };
    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    if (leftCol) ro.observe(leftCol);

    // ── 2. Init all panels: absolute stack, first visible ──
    panels.forEach((p, i) => {
      p.style.position = "absolute";
      p.style.inset = "0";
      p.style.transition = "opacity 0.6s ease";
      p.style.opacity = i === 0 ? "1" : "0";
      p.style.pointerEvents = i === 0 ? "auto" : "none";
      p.style.zIndex = i === 0 ? "2" : "1";
    });

    // ── 3. Init cards ──
    steps.forEach((s, i) => {
      s.style.transition = "opacity 0.4s ease, background-color 0.4s ease";
      s.style.opacity = i === 0 ? "1" : "0.4";
      s.style.backgroundColor = i === 0 ? "#F7F7F9" : "#ffffff";
    });

    // ── 4. Switch active panel & card ──
    let current = -1; // -1 forces initial run
    function switchTo(idx) {
      if (idx === current) return;
      current = idx;

      panels.forEach((p) => {
        const panelIdx = Number(p.getAttribute("data-panel"));
        const active = panelIdx === idx;
        p.style.opacity = active ? "1" : "0";
        p.style.pointerEvents = active ? "auto" : "none";
        p.style.zIndex = active ? "2" : "1";
      });

      steps.forEach((s) => {
        const stepIdx = Number(s.getAttribute("data-step"));
        const active = stepIdx === idx;
        s.style.opacity = active ? "1" : "0.4";
        s.style.backgroundColor = active ? "#F7F7F9" : "#ffffff";
      });
    }

    // ── 5. Detect which step is closest to viewport center on every scroll ──
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const mid = window.innerHeight / 2;
        let closest = 0;
        let minDist = Infinity;
        steps.forEach((s, i) => {
          const rect = s.getBoundingClientRect();
          const cardMid = rect.top + rect.height / 2;
          const dist = Math.abs(cardMid - mid);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        switchTo(closest);
        ticking = false;
      });
    }

    // Run once on mount + listen
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return null;
}