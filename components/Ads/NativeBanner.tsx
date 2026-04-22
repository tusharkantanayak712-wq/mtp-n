"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface AdsterraBannerProps {
  id?: string;
  src?: string;
  className?: string;
}

/**
 * Reusable Adsterra Banner component.
 * Defaults to the tasks page banner if no props are provided.
 */
export default function NativeBanner({
  id = "c755433b5487dae7313fbaa97a482b40",
  src = "https://pl29207483.profitablecpmratenetwork.com/c755433b5487dae7313fbaa97a482b40/invoke.js",
  className = ""
}: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`flex justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--foreground)]/[0.03] min-h-[50px] ${className}`}>
      <div id={`container-${id}`} ref={containerRef}></div>
      <Script 
        async 
        data-cfasync="false" 
        src={src} 
        strategy="afterInteractive"
      />
    </div>
  );
}
