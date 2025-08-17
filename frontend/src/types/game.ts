export type GameDifficulty = "easy" | "medium" | "hard";
export type GameType = "subitisation" | "manipulatives";

export interface GameSettings {
  difficulty: GameDifficulty;
  timerDuration: number; // 3-10 seconds
  sessionLength: number; // 5, 10, or 15 questions
  audioEnabled: boolean;
  gameType: GameType;
}

import { DotPosition } from "@/utils/dotPatterns";

// Question type for the Subitisation game
export interface SubitisationQuestion {
  id: string;
  type: "subitisation";
  dotCount: number;
  dotPositions: DotPosition[];
  timeStarted: number;
}

// Question type for the Manipulatives game
export interface ManipulativesQuestion {
  id: string;
  type: "manipulatives";
  leftGroup: number;
  rightGroup: number;
  operation: "+" | "-";
  correctAnswer: number;
  timeStarted: number;
}

export type Question = SubitisationQuestion | ManipulativesQuestion;

export interface Response {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  responseTime: number;
}

export interface GameSession {
  id: string;
  settings: GameSettings;
  questions: Question[];
  responses: Response[];
  currentQuestionIndex: number;
  isActive: boolean;
  isPaused: boolean;
  startTime: number;
  endTime?: number;
}

export interface GameStats {
  totalQuestions: number;
  correctAnswers: number;
  averageResponseTime: number;
  accuracy: number;
}
