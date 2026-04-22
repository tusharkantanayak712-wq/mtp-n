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
    // Set the options on window so the invoke.js can find them
    (window as any).atOptions = {
      'key' : '183ee4e45520fb7aa8e1d934a0970c31',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  }, []);

  return (
    <div className={`flex justify-center overflow-hidden py-1 ${className}`}>
      <div className="relative border border-[var(--border)] rounded-lg bg-[var(--foreground)]/[0.03] overflow-hidden shadow-sm" style={{ width: '320px', height: '50px' }}>
         <Script 
           async 
           src="https://www.highperformanceformat.com/183ee4e45520fb7aa8e1d934a0970c31/invoke.js" 
           strategy="afterInteractive"
         />
      </div>
    </div>
  );
}
