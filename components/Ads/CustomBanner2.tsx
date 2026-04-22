"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface CustomBannerProps {
  className?: string;
}

/**
 * Reusable Adsterra 320x50 Mobile Banner.
 */
export default function CustomBanner2({ className = "" }: CustomBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing content to prevent duplicates on remount
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    const options = document.createElement("script");

    options.innerHTML = `
      atOptions = {
        'key' : '183ee4e45520fb7aa8e1d934a0970c31',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    script.src = "https://www.highperformanceformat.com/183ee4e45520fb7aa8e1d934a0970c31/invoke.js";
    script.async = true;

    containerRef.current.appendChild(options);
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`flex justify-center overflow-hidden py-1 ${className}`}>
      <div 
        ref={containerRef}
        className="relative border border-[var(--border)] rounded-lg bg-[var(--foreground)]/[0.03] overflow-hidden shadow-sm" 
        style={{ width: '320px', height: '50px' }}
      ></div>
    </div>
  );
}
