"use client";
import { useEffect } from "react";

export default function HiwScroll() {
  useEffect(() => {
    const steps = document.querySelectorAll(".hiw-step");
    const panels = document.querySelectorAll(".hiw-image");
    
    // Set up panels for crossfade
    panels.forEach((p, i) => {
      p.style.transition = "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      p.style.position = i === 0 ? "relative" : "absolute";
      p.style.top = "0";
      p.style.left = "0";
      p.style.width = "100%";
      p.style.display = "block"; // override any display: none
      p.style.opacity = i === 0 ? "1" : "0";
      p.style.pointerEvents = i === 0 ? "auto" : "none";
      p.style.transform = i === 0 ? "translateY(0)" : "translateY(40px)";
    });

    // Set up initial state for steps
    steps.forEach((s, i) => {
      s.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      s.style.opacity = i === 0 ? "1" : "0.3";
    });

    if (!steps.length || !panels.length) return;

    // Use a tighter threshold to trigger exactly when the block crosses the middle of the screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-step");
            
            // Crossfade panels with premium ease
            panels.forEach((p) => {
              if (p.getAttribute("data-panel") === idx) {
                p.style.opacity = "1";
                p.style.pointerEvents = "auto";
                p.style.transform = "translateY(0)";
              } else {
                p.style.opacity = "0";
                p.style.pointerEvents = "none";
                p.style.transform = "translateY(40px)";
              }
            });
            
            // Highlight active step
            steps.forEach((s) => {
              if (s.getAttribute("data-step") === idx) {
                s.style.opacity = "1";
                s.style.transform = "scale(1)";
              } else {
                s.style.opacity = "0.3";
                s.style.transform = "scale(0.98)";
              }
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: "-35% 0px -35% 0px" }
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return null;
}
