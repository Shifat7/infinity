"use client";

import React, { useEffect } from "react";
import { Clock } from "lucide-react";
import { playSound } from "@/utils/audio";

interface TimerProps {
  timeRemaining: number;
  isPaused: boolean;
  totalTime?: number;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isPaused,
  totalTime = 10,
}) => {
  const pct = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
  const tier =
    timeRemaining <= 3 ? "danger" : timeRemaining <= 6 ? "warn" : "ok";

  useEffect(() => {
    if (timeRemaining === 3 && !isPaused) playSound("timeWarning");
  }, [timeRemaining, isPaused]);

  const palette =
    tier === "danger"
      ? "bg-red-200 text-red-900"
      : tier === "warn"
      ? "bg-yellow-200 text-yellow-900"
      : "bg-soft-green text-green-900";

  const bar =
    tier === "danger"
      ? "bg-red-600"
      : tier === "warn"
      ? "bg-yellow-600"
      : "bg-green-700";

  return (
    <div
      className={[
        "flex items-center gap-2 px-3 py-2 rounded-xl",
        "border-2 border-black font-black",
        palette,
      ].join(" ")}
      aria-label={`Time remaining ${timeRemaining} seconds`}
    >
      <Clock size={16} />
      <span className="text-lg tabular-nums">{timeRemaining}s</span>
      <div className="w-20 h-2 bg-white/60 border-2 border-black rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
