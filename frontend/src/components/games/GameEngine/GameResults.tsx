"use client";

import React, { useEffect } from "react";
import { GameStats } from "@/types/game";
import { Trophy, Target, Clock, RotateCcw, Home } from "lucide-react";

interface GameResultsProps {
  stats: GameStats;
  onRestart: () => void;
  onNewGame: () => void;
  gameTitle: string;
  saveSessionResults: (child_id: number, game_id: number) => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  stats,
  onRestart,
  onNewGame,
  gameTitle,
  saveSessionResults,
}) => {
  useEffect(() => {
    // TODO: Replace with actual child and game IDs
    saveSessionResults(1, 1);
  }, [saveSessionResults]);

  const encouragement = (() => {
    if (stats.accuracy >= 90)
      return "Outstanding! You’re a subitisation superstar! 🌟";
    if (stats.accuracy >= 80) return "Excellent work! Comic-level reflexes! 🎉";
    if (stats.accuracy >= 70)
      return "Great job! Your glance game is strong! 👏";
    if (stats.accuracy >= 50) return "Nice effort! Keep practising! 💪";
    return "Good try! Every round powers you up! 🚀";
  })();

  const accColor =
    stats.accuracy >= 80
      ? "text-green-700"
      : stats.accuracy >= 60
      ? "text-yellow-700"
      : "text-blue-700";

  return (
    <div className="max-w-md mx-auto p-6 bg-white border-4 border-black rounded-2xl shadow-[10px_10px_0_#000]">
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🎯</div>
        <h1 className="text-2xl font-black uppercase tracking-wider">
          {gameTitle} Session Complete!
        </h1>
        <p className="mt-2 text-gray-800 font-medium">{encouragement}</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-4 bg-blue/40 border-2 border-black rounded-xl">
          <div className="flex items-center gap-3">
            <Trophy className="text-black" size={24} />
            <span className="font-black">Questions</span>
          </div>
          <span className="text-xl font-black">{stats.totalQuestions}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-green/40 border-2 border-black rounded-xl">
          <div className="flex items-center gap-3">
            <Target className="text-green-700" size={24} />
            <span className="font-black">Correct</span>
          </div>
          <span className="text-xl font-black text-green-700">
            {stats.correctAnswers} / {stats.totalQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-pink/40 border-2 border-black rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-pink border-2 border-black rounded-full grid place-items-center">
              <span className="text-black text-xs font-black">%</span>
            </div>
            <span className="font-black">Accuracy</span>
          </div>
          <span className={`text-xl font-black ${accColor}`}>
            {Math.round(stats.accuracy)}%
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-yellow/40 border-2 border-black rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-700" size={24} />
            <span className="font-black">Avg. Time</span>
          </div>
          <span className="text-xl font-black text-yellow-700">
            {(stats.averageResponseTime / 1000).toFixed(1)}s
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-green border-2 border-black rounded-xl font-black uppercase tracking-wide shadow-[6px_6px_0_#000] active:translate-y-0.5"
        >
          <RotateCcw size={20} />
          Play Again (Same Settings)
        </button>
        <button
          onClick={onNewGame}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue border-2 border-black rounded-xl font-black uppercase tracking-wide shadow-[6px_6px_0_#000] active:translate-y-0.5"
        >
          <Home size={20} />
          New Game (Different Settings)
        </button>
      </div>

      <div className="mt-6 p-4 bg-white border-2 border-black rounded-xl text-center">
        <p className="text-sm text-gray-700">
          <strong>Remember:</strong> Subitisation improves with practice—spot
          the pattern at a glance!
        </p>
      </div>
    </div>
  );
};
