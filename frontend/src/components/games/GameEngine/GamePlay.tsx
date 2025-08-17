"use client";

import { DotDisplay } from "@/components/games/GameEngine/DotDisplay";
import { NumberButtons } from "@/components/games/GameEngine/NumberButtons";
import { Timer } from "@/components/games/GameEngine/Timer";
import { ManipulativesGameBoard } from "@/components/games/manipulatives/components/ManipulativesGameBoard";
import { Question } from "@/types/game";
import { Pause, Play } from "lucide-react";
import React, { useEffect } from "react";

interface GamePlayProps {
  question: Question;
  timeRemaining: number;
  onAnswer: (answer: number) => void;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  showFeedback: boolean;
  feedbackMessage: string;
  isCorrect: boolean;
  questionNumber: number;
  totalQuestions: number;
  gameInstructions: string;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  question,
  timeRemaining,
  onAnswer,
  isPaused,
  onPause,
  onResume,
  showFeedback,
  feedbackMessage,
  isCorrect,
  questionNumber,
  totalQuestions,
  gameInstructions,
}) => {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showFeedback || isPaused) return;
      if (/^[0-9]$/.test(event.key)) {
        const n = event.key === "0" ? 10 : parseInt(event.key, 10);
        if (n >= 1 && n <= 10) onAnswer(n);
      } else if (event.key === " ") {
        event.preventDefault();
        isPaused ? onResume() : onPause();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onAnswer, showFeedback, isPaused, onPause, onResume]);

  if (showFeedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[520px] p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">{isCorrect ? "💥" : "💪"}</div>
          {/* removed outline/double text */}
          <h2 className="text-3xl font-extrabold tracking-wide mb-2">
            {feedbackMessage}
          </h2>
          <p className="text-gray-700 font-medium">
            Get ready for the next question…
          </p>
        </div>
      </div>
    );
  }

  return (
    // Wider shell so it doesn't feel squished on tablet
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col min-h-[70vh] sm:min-h-[74vh] bg-white border-4 border-black rounded-2xl shadow-[10px_10px_0_#000] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-yellow border-b-4 border-black">
          <div className="text-sm sm:text-base font-extrabold tracking-wide">
            Question {questionNumber} / {totalQuestions}
          </div>
          <div className="flex items-center gap-3">
            <Timer
              timeRemaining={timeRemaining}
              isPaused={isPaused}
              totalTime={10}
            />
            <button
              onClick={isPaused ? onResume : onPause}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-black font-extrabold uppercase tracking-wide transition-transform active:scale-95 ${
                isPaused
                  ? "bg-green hover:brightness-95"
                  : "bg-pink hover:brightness-95"
              }`}
              aria-pressed={isPaused}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>
          </div>
        </div>

        {/* Pause overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/40 z-50 grid place-items-center">
            <div className="bg-white border-4 border-black rounded-2xl shadow-[10px_10px_0_#000] p-8 text-center w-md">
              <div className="text-5xl mb-3">⏸️</div>
              {/* no outline/double text */}
              <h2 className="text-2xl font-extrabold mb-2">Game Paused</h2>
              <p className="text-gray-700 my-4">
                Press{" "}
                <kbd className="mx-2 px-2 py-1 border-2 border-black bg-gray-100 rounded">
                  Space
                </kbd>{" "}
                or click resume.
              </p>
              <button
                onClick={onResume}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-green border-2 border-black rounded-xl font-extrabold uppercase tracking-wide transition-transform active:scale-95"
              >
                <Play size={20} />
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Instruction strip (no doubled text) */}
        <div className="px-4 py-3 bg-blue/10 border-b-4 border-black">
          <div className="bg-white p-3 rounded-xl border-2 border-black">
            <h3 className="text-lg font-extrabold tracking-wide">
              Subitisation
            </h3>
            <p className="text-sm text-gray-800">{gameInstructions}</p>
          </div>
        </div>

        {/* Stage - fluid container */}
        <div className="flex-1 grid place-items-center p-4 sm:p-6">
          {question.type === "subitisation" ? (
            // DotDisplay already enforces aspect-square internally
            <div className="w-full max-w-[28rem]">
              <DotDisplay
                dotPositions={question.dotPositions}
                isVisible={!isPaused}
              />
            </div>
          ) : (
            // Manipulatives fills width (no square)
            <div className="w-full max-w-[48rem]">
              <ManipulativesGameBoard question={question} />
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="p-5 bg-gray-50 border-t-4 border-black">
          <NumberButtons onAnswer={onAnswer} disabled={isPaused} />
        </div>

        {/* Progress */}
        <div className="h-3 bg-white border-t-4 border-black relative">
          <div
            className="absolute left-0 top-0 h-full bg-blue border-r-4 border-black transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};
