"use client";

import React from "react";

interface NumberButtonsProps {
  onAnswer: (answer: number) => void;
  disabled?: boolean;
}

export const NumberButtons: React.FC<NumberButtonsProps> = ({
  onAnswer,
  disabled = false,
}) => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Slightly larger grid gaps for tablet */}
      <div className="grid grid-cols-5 gap-4">
        {nums.map((n) => (
          <button
            key={n}
            onClick={() => onAnswer(n)}
            disabled={disabled}
            aria-label={`Answer: ${n} dots`}
            className={[
              "aspect-square flex items-center justify-center text-3xl sm:text-4xl font-extrabold",
              "rounded-xl border-4 border-black",
              "shadow-[8px_8px_0_#000] hover:shadow-[10px_10px_0_#000]",
              "hover:-translate-y-0.5 active:translate-y-0 transition-all",
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : n <= 5
                ? "bg-yellow text-gray-900 hover:brightness-95"
                : "bg-pink text-gray-900 hover:brightness-95",
            ].join(" ")}
          >
            {n}
          </button>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Tip: press{" "}
        <kbd className="px-1 mx-2 border-2 border-black bg-gray-100 rounded">
          1–9
        </kbd>{" "}
        or{" "}
        <kbd className="px-1 mx-2 border-2 border-black bg-gray-100 rounded">
          0
        </kbd>{" "}
        for 10.
      </p>
    </div>
  );
};
