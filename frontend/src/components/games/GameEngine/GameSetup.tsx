import React, { useState } from "react";
import { GameSettings, GameType } from "@/types/game";
import { Play, Volume2, VolumeX } from "lucide-react";

interface GameSetupProps {
  onStartGame: (settings: GameSettings) => void;
  savedSettings?: GameSettings;
  gameTitle: string;
  gameDescription: string;
  gameType: GameType;
  difficultyDescriptions: { easy: string; medium: string; hard: string };
}

export const GameSetup: React.FC<GameSetupProps> = ({
  onStartGame,
  savedSettings,
  gameTitle,
  gameDescription,
  gameType,
  difficultyDescriptions,
}) => {
  const [settings, setSettings] = useState<GameSettings>(
    savedSettings || {
      difficulty: "easy",
      timerDuration: 5,
      sessionLength: 10,
      audioEnabled: true,
      gameType: gameType,
    }
  );

  const handleStart = () => {
    onStartGame(settings);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{gameTitle}</h1>
        <p className="text-gray-600">{gameDescription}</p>
      </div>

      <div className="space-y-6">
        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Difficulty Level
          </label>
          <div className="space-y-2">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <label
                key={level}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={level}
                  checked={settings.difficulty === level}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: e.target.value as "easy" | "medium" | "hard",
                    }))
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium capitalize">{level}</div>
                  <div className="text-sm text-gray-500">
                    {difficultyDescriptions[level]}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Timer Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time per Question: {settings.timerDuration} seconds
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={settings.timerDuration}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                timerDuration: parseInt(e.target.value),
              }))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3s (Fast)</span>
            <span>10s (Relaxed)</span>
          </div>
        </div>

        {/* Session Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((length) => (
              <button
                key={length}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, sessionLength: length }))
                }
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  settings.sessionLength === length
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {length}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Settings */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">Sound Effects</div>
            <div className="text-sm text-gray-500">
              Audio feedback and encouragement
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                audioEnabled: !prev.audioEnabled,
              }))
            }
            className={`p-2 rounded-lg transition-colors ${
              settings.audioEnabled
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {settings.audioEnabled ? (
              <Volume2 size={20} />
            ) : (
              <VolumeX size={20} />
            )}
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <Play size={20} />
          <span>Start Game</span>
        </button>
      </div>
    </div>
  );
};
