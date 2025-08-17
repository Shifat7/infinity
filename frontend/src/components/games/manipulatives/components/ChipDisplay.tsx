"use client";
import React from "react";

type Sign = "positive" | "negative";
type Size = "small" | "medium" | "large";

interface ChipDisplayProps {
  count: number;
  sign: Sign;
  size?: Size;
}

function dims(size: Size) {
  switch (size) {
    case "small":
      return { box: "w-6 h-6", gap: "gap-1.5", pad: "p-3", auto: "1.5rem" };
    case "large":
      return { box: "w-10 h-10", gap: "gap-2.5", pad: "p-6", auto: "2.5rem" };
    case "medium":
    default:
      return { box: "w-8 h-8", gap: "gap-2", pad: "p-5", auto: "2rem" };
  }
}

/* ---------- color map by TOTAL COUNT ---------- */
const COLOR_BY_COUNT: Record<number, string> = {
  1: "#22C55E", // green
  2: "#F97316", // orange
  3: "#EC4899", // pink
  4: "#F59E0B", // yellow
  5: "#38BDF8", // sky blue
  6: "#8B5CF6", // purple
  7: "#FFFFFF", // white
  8: "#7B3F00", // chocolate brown
  9: "#0D9488", // teal
  10: "#1E3A8A", // dark blue
  100: "#EF4444", // red (hundred square)
};

const colorForCount = (n: number) => {
  if (COLOR_BY_COUNT[n]) return COLOR_BY_COUNT[n];
  const bucket = (n % 10 || 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  return COLOR_BY_COUNT[bucket];
};

export function ChipDisplay({ count, sign, size = "large" }: ChipDisplayProps) {
  const { box, gap, pad, auto } = dims(size);

  // 10×10 for 100; otherwise up to 5 cols (tidy tray look)
  const cols = count === 100 ? 10 : Math.max(1, Math.min(5, count || 1));
  const cubeColor = colorForCount(Math.max(0, count));

  return (
    <div
      className={[
        "relative bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_#000]",
        "inline-flex flex-col items-center",
        pad,
      ].join(" ")}
      role="group"
      aria-label={`${
        sign === "positive" ? "Positive" : "Negative"
      } color cubes`}
    >
      {/* Sign tag (accent only) */}
      <div
        className={[
          "absolute -top-3 left-4 px-2 py-0.5 text-xs font-black uppercase rounded-md border-2 border-black",
          sign === "positive" ? "bg-green" : "bg-rose-200",
        ].join(" ")}
      >
        {sign === "positive" ? "Positive" : "Negative"}
      </div>

      {count === 0 ? (
        <div className="text-gray-400 text-sm font-semibold">No cubes</div>
      ) : (
        <div
          className={["grid", gap].join(" ")}
          style={{
            gridTemplateColumns: `repeat(${cols}, auto)`,
            gridAutoRows: auto,
            justifyContent: "center",
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={[
                box,
                "rounded-md border-2 border-black shadow-[3px_3px_0_#000]",
              ].join(" ")}
              style={{ backgroundColor: cubeColor }}
              role="img"
              aria-label={`Cube ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div
        className={[
          "mt-3 text-sm font-black",
          sign === "positive" ? "text-gray-900" : "text-rose-700",
        ].join(" ")}
      >
        {count} {count === 1 ? "Cube" : "Cubes"}
      </div>
    </div>
  );
}
