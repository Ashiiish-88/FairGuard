"use client";
import { useEffect } from "react";

export default function HiwScroll() {
  useEffect(() => {
    const steps = document.querySelectorAll(".hiw-step");
    const panels = document.querySelectorAll(".hiw-image");
    if (!steps.length || !panels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.getAttribute("data-step");
            // Hide all panels, show matching one
            panels.forEach((p) => {
              p.style.display = p.getAttribute("data-panel") === idx ? "block" : "none";
            });
            // Highlight active step
            steps.forEach((s) => {
              if (s.getAttribute("data-step") === idx) {
                s.style.borderColor = "#F59E0B";
                s.style.boxShadow = "0 4px 20px rgba(245,158,11,0.1)";
              } else {
                s.style.borderColor = "#E5E7EB";
                s.style.boxShadow = "none";
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-30% 0px -30% 0px" }
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return null;
}
