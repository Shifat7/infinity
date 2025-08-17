import {
  GameDifficulty,
  GameSession,
  GameSettings,
  GameStats,
  ManipulativesQuestion,
  Question,
  Response,
  SubitisationQuestion,
} from "@/types/game";
import { sendGameResult } from "@/lib/api";
import { playSound } from "@/utils/audio";
import {
  generateAlternativeClusteredPattern,
  generateDotPattern,
} from "@/utils/dotPatterns";
import { useCallback, useEffect, useState } from "react";

const DIFFICULTY_RANGES: Record<GameDifficulty, { min: number; max: number }> =
  {
    easy: { min: 3, max: 5 },
    medium: { min: 3, max: 7 },
    hard: { min: 3, max: 10 },
  };

interface CustomWindow extends Window {
  nextQuestionTimeout?: NodeJS.Timeout;
}

export const useGameEngine = () => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleAnswer = useCallback(
    (userAnswer: number) => {
      setSession((prevSession) => {
        if (!prevSession || !prevSession.isActive || prevSession.isPaused) {
          return prevSession;
        }

        if ((window as CustomWindow).nextQuestionTimeout) {
          clearTimeout((window as CustomWindow).nextQuestionTimeout);
        }

        const currentQuestion =
          prevSession.questions[prevSession.currentQuestionIndex];
        const correctAnswer =
          currentQuestion.type === "subitisation"
            ? currentQuestion.dotCount
            : currentQuestion.correctAnswer;
        const isCorrect = userAnswer === correctAnswer;
        const responseTime = Date.now() - currentQuestion.timeStarted;

        const response: Response = {
          questionId: currentQuestion.id,
          userAnswer,
          correctAnswer,
          isCorrect,
          responseTime,
        };

        if (userAnswer === -1) {
          setFeedbackMessage("Time's up! Let's try the next one.");
          setIsCorrect(false);
        } else if (isCorrect) {
          const encouragements = [
            "Great job!",
            "Excellent!",
            "Perfect!",
            "Well done!",
            "Amazing!",
            "You got it!",
            "Fantastic!",
            "Outstanding!",
          ];
          setFeedbackMessage(
            encouragements[Math.floor(Math.random() * encouragements.length)]
          );
          setIsCorrect(true);
        } else {
          const supportive = [
            "Good try! Keep going!",
            "Nice effort! You're learning!",
            "Keep it up!",
            "You're doing great!",
            "Almost there!",
          ];
          setFeedbackMessage(
            supportive[Math.floor(Math.random() * supportive.length)]
          );
          setIsCorrect(false);
        }

        setShowFeedback(true);

        if (prevSession.settings.audioEnabled) {
          playSound(isCorrect ? "correct" : "incorrect");
        }

        (window as CustomWindow).nextQuestionTimeout = setTimeout(() => {
          setShowFeedback(false);

          setSession((prev) => {
            if (!prev) return null;
            const nextIndex = prev.currentQuestionIndex + 1;
            if (nextIndex >= prev.questions.length) {
              return {
                ...prev,
                currentQuestionIndex: nextIndex,
                isActive: false,
                endTime: Date.now(),
              };
            }
            return { ...prev, currentQuestionIndex: nextIndex };
          });

          if (
            prevSession.currentQuestionIndex + 1 <
            prevSession.questions.length
          ) {
            setTimeRemaining(prevSession.settings.timerDuration);
          }
        }, 1500);

        return {
          ...prevSession,
          responses: [...prevSession.responses, response],
        };
      });
    },
    [setSession]
  );

  useEffect(() => {
    if (session && session.isActive && !session.isPaused && timeRemaining > 0) {
      const timer = setTimeout(
        () => setTimeRemaining((prev) => prev - 1),
        1000
      );
      return () => clearTimeout(timer);
    } else if (
      timeRemaining === 0 &&
      session &&
      session.isActive &&
      !showFeedback
    ) {
      handleAnswer(-1);
    }
  }, [timeRemaining, session, showFeedback, handleAnswer]);

  const generateSubitisationQuestion = useCallback(
    (settings: GameSettings): SubitisationQuestion => {
      const range = DIFFICULTY_RANGES[settings.difficulty];
      const dotCount =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const useAlternative = Math.random() > 0.7;
      const dotPositions = useAlternative
        ? generateAlternativeClusteredPattern(dotCount)
        : generateDotPattern(dotCount);

      return {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "subitisation",
        dotCount,
        dotPositions,
        timeStarted: Date.now(),
      };
    },
    []
  );

  const generateManipulativesQuestion = useCallback(
    (settings: GameSettings): ManipulativesQuestion => {
      const range = DIFFICULTY_RANGES[settings.difficulty];
      const range1to5 = () => Math.floor(Math.random() * 5) + 1;
      const leftGroup = range1to5();
      const rightGroup = range1to5();
      const operation = "+";
      const correctAnswer =
        operation === "+" ? leftGroup + rightGroup : leftGroup - rightGroup;

      return {
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "manipulatives",
        leftGroup,
        rightGroup,
        operation,
        correctAnswer,
        timeStarted: Date.now(),
      };
    },
    []
  );

  const startNewSession = useCallback(
    (settings: GameSettings) => {
      const questions: Question[] = [];
      for (let i = 0; i < settings.sessionLength; i++) {
        if (settings.gameType === "subitisation") {
          questions.push(generateSubitisationQuestion(settings));
        } else {
          questions.push(generateManipulativesQuestion(settings));
        }
      }

      const newSession: GameSession = {
        id: `session${Date.now()}`,
        settings,
        questions,
        responses: [],
        currentQuestionIndex: 0,
        isActive: true,
        isPaused: false,
        startTime: Date.now(),
      };

      setSession(newSession);
      setTimeRemaining(settings.timerDuration);
      setShowFeedback(false);

      if (settings.audioEnabled) playSound("gameStart");
    },
    [generateSubitisationQuestion, generateManipulativesQuestion]
  );

  const pauseSession = useCallback(() => {
    if (session)
      setSession((prev) => (prev ? { ...prev, isPaused: true } : null));
  }, [session]);

  const resumeSession = useCallback(() => {
    if (session)
      setSession((prev) => (prev ? { ...prev, isPaused: false } : null));
  }, [session]);

  const restartSession = useCallback(() => {
    if (session) startNewSession(session.settings);
  }, [session, startNewSession]);

  const endSession = useCallback(() => {
    setSession((prev) =>
      prev ? { ...prev, isActive: false, endTime: Date.now() } : null
    );
  }, []);

  const clearSession = useCallback(() => setSession(null), []);

  const getGameStats = useCallback((): GameStats | null => {
    if (!session || session.responses.length === 0) return null;
    const correctAnswers = session.responses.filter((r) => r.isCorrect).length;
    const totalQuestions = session.responses.length;
    const averageResponseTime =
      session.responses.reduce((sum, r) => sum + r.responseTime, 0) /
      totalQuestions;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    return { totalQuestions, correctAnswers, averageResponseTime, accuracy };
  }, [session]);

  const getCurrentQuestion = useCallback((): Question | null => {
    if (!session || session.currentQuestionIndex >= session.questions.length)
      return null;
    return session.questions[session.currentQuestionIndex];
  }, [session]);

  const saveSessionResults = useCallback(async (child_id: number, game_id: number) => {
    if (!session || !session.endTime) return;

    const stats = getGameStats();
    if (!stats) return;

    const payload = {
      child_id,
      game_id,
      score: stats.correctAnswers,
      time_taken_seconds: (session.endTime - session.startTime) / 1000,
      feedback_data: {
        responses: session.responses,
        ...stats,
      },
    };

    try {
      await sendGameResult(payload);
    } catch (error) {
      console.error("Failed to save game results:", error);
      // Optionally, handle the error in the UI
    }
  }, [session, getGameStats]);

  return {
    session,
    timeRemaining,
    showFeedback,
    feedbackMessage,
    isCorrect,
    startNewSession,
    pauseSession,
    resumeSession,
    handleAnswer,
    restartSession,
    endSession,
    clearSession,
    getGameStats,
    getCurrentQuestion,
    saveSessionResults,
    isSessionComplete: session
      ? session.currentQuestionIndex >= session.questions.length
      : false,
  };
};
