import React, { useRef, useEffect } from "react";
import { animateSpinner } from "./animations";

export const Spinner = () => {
  const ringRef = useRef(null);
  const textRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    tlRef.current = animateSpinner(ringRef.current, textRef.current);
    return () => tlRef.current?.kill();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-onyx-black gap-6">
      {/* Concentric rings — outer static, inner GSAP-driven */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border border-onyx-border/40" />
        <div className="absolute inset-[4px] rounded-full border border-onyx-border/20" />
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border-t border-onyx-gold will-change-transform"
          style={{ transformOrigin: "50% 50%" }}
        />
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-onyx-gold/60" />
      </div>

      <p
        ref={textRef}
        className="text-[9px] tracking-[0.45em] uppercase opacity-0"
        style={{ color: "rgba(238,233,225,0.3)", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        ONYX
      </p>
    </div>
  );
};
