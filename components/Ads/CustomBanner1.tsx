"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface CustomBannerProps {
  className?: string;
}

/**
 * Reusable Adsterra 300x250 Iframe Banner.
 */
export default function CustomBanner1({ className = "" }: CustomBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing content to prevent duplicates on remount
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    const options = document.createElement("script");

    options.innerHTML = `
      atOptions = {
        'key' : '12769ff4f11c1254fd7310aea93f838d',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    script.src = "https://www.highperformanceformat.com/12769ff4f11c1254fd7310aea93f838d/invoke.js";
    script.async = true;

    containerRef.current.appendChild(options);
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`flex justify-center overflow-hidden py-2 ${className}`}>
      <div 
        ref={containerRef}
        className="relative border border-[var(--border)] rounded-xl bg-[var(--foreground)]/[0.03] overflow-hidden shadow-lg" 
        style={{ width: '300px', height: '250px' }}
      ></div>
    </div>
  );
}
