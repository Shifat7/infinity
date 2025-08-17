"use client";

import React, { useId } from "react";
import { DotPosition } from "@/utils/dotPatterns";

interface DotDisplayProps {
  dotPositions: DotPosition[];
  isVisible: boolean;
}

export const DotDisplay: React.FC<DotDisplayProps> = ({
  dotPositions,
  isVisible,
}) => {
  const gridId = useId();

  const clusters = dotPositions.reduce((m, d) => {
    (m[d.clusterId] ??= []).push(d);
    return m;
  }, {} as Record<number, DotPosition[]>);

  return (
    // Note: no hard max-width here — parent stage controls size
    <div className="relative w-full max-w-md aspect-square bg-white border-8 border-black rounded-3xl shadow-[16px_16px_0_#000] overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none halftone-wash" />

      {isVisible &&
        dotPositions.map((dot, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 rounded-full border-4 border-black shadow-[3px_3px_0_#000] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              backgroundColor: dot.color,
              animation: "dotPop 260ms ease-out forwards",
              animationDelay: `${dot.clusterId * 0.12}s`,
            }}
            aria-hidden
          />
        ))}

      {/* Light grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id={gridId}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="black"
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      </div>

      {/* A11y hint */}
      <div className="absolute bottom-2 left-2 text-xs font-bold text-gray-800 bg-white/80 border-2 border-black rounded-lg px-2 py-1">
        {Object.keys(clusters).length} cluster
        {Object.keys(clusters).length !== 1 ? "s" : ""}
      </div>

      <style jsx>{`
        @keyframes dotPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.15);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
