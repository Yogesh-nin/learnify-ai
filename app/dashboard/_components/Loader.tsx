"use client";
import React from "react";

function Loader() {
  const dots = new Array(8).fill(0);

  return (
    <div className="relative w-10 h-10">
      {dots.map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 flex items-start justify-center"
          style={{
            transform: `rotate(${i * 45}deg)`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full bg-[#183153] opacity-50 animate-pulseScale shadow-[0_0_20px_rgba(18,31,53,0.3)]"
            style={{
              animationDelay: `${-0.9 + i * 0.1125}s`
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Loader;