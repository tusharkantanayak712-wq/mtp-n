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
    // Set the options on window so the invoke.js can find them
    (window as any).atOptions = {
      'key' : '12769ff4f11c1254fd7310aea93f838d',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  }, []);

  return (
    <div className={`flex justify-center overflow-hidden py-2 ${className}`}>
      <div className="relative border border-[var(--border)] rounded-xl bg-[var(--foreground)]/[0.03] overflow-hidden shadow-lg" style={{ width: '300px', height: '250px' }}>
         {/* The script usually appends the iframe inside it or writes directly to the DOM */}
         <Script 
           async 
           src="https://www.highperformanceformat.com/12769ff4f11c1254fd7310aea93f838d/invoke.js" 
           strategy="afterInteractive"
         />
      </div>
    </div>
  );
}
