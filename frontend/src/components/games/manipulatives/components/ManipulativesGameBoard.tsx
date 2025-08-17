"use client";
import React from "react";
import { ManipulativesQuestion } from "@/types/game";
import { ChipDisplay } from "./ChipDisplay";
import { Plus, Minus } from "lucide-react";

interface ManipulativesGameBoardProps {
  question: ManipulativesQuestion;
}

/** Comic board that stretches to available width (no aspect-square). */
export const ManipulativesGameBoard: React.FC<ManipulativesGameBoardProps> = ({
  question,
}) => {
  const leftSign = question.leftGroup >= 0 ? "positive" : "negative";
  const rightSign = question.rightGroup >= 0 ? "positive" : "negative";

  return (
    <div className="relative mx-auto w-full bg-white border-8 border-black rounded-3xl shadow-[16px_16px_0_#000] p-4 sm:p-6 overflow-hidden">
      {/* subtle backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-15 halftone-wash" />

      <div className="relative grid gap-4 sm:gap-6">
        {/* Groups + operator */}
        <div className="flex justify-between w-full items-center">
          <div className="grid place-items-center">
            <ChipDisplay
              count={Math.abs(question.leftGroup)}
              sign={leftSign}
              size="large"
            />
            <div className="mt-2 text-lg font-black">{question.leftGroup}</div>
          </div>

          <div className="grid place-items-center">
            <div className="bg-yellow border-4 border-black rounded-full w-16 h-16 grid place-items-center shadow-[6px_6px_0_#000]">
              {question.operation === "+" ? (
                <Plus size={36} className="text-green-700" aria-label="Plus" />
              ) : (
                <Minus size={36} className="text-rose-700" aria-label="Minus" />
              )}
            </div>
          </div>

          <div className="grid place-items-center">
            <ChipDisplay
              count={Math.abs(question.rightGroup)}
              sign={rightSign}
              size="large"
            />
            <div className="mt-2 text-lg font-black">{question.rightGroup}</div>
          </div>
        </div>

        {/* Equation strip */}
        <div className="grid place-items-center">
          <div className="px-4 py-3 bg-blue/10 border-4 border-black rounded-xl shadow-[6px_6px_0_#000]">
            <span className="text-2xl sm:text-3xl font-black">
              {question.leftGroup} {question.operation} {question.rightGroup} =
              ?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
