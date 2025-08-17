"use client";
import { GamePlay } from "@/components/games/GameEngine/GamePlay";
import { GameResults } from "@/components/games/GameEngine/GameResults";
import { GameSetup } from "@/components/games/GameEngine/GameSetup";
import { useGameEngine } from "@/hooks/useGameEngine";
import { setAudioEnabled } from "@/utils/audio";
import { useEffect } from "react";

function ManipulativesGame() {
  const {
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
    clearSession,
    getGameStats,
    getCurrentQuestion,
    isSessionComplete,
    saveSessionResults,
  } = useGameEngine();

  // Update audio settings when session changes
  useEffect(() => {
    if (session) {
      setAudioEnabled(session.settings.audioEnabled);
    }
  }, [session?.settings.audioEnabled]);

  // Game setup screen
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <GameSetup
          onStartGame={startNewSession}
          gameTitle="Integer Blocks"
          gameDescription="Learn addition and subtraction with positive and negative numbers using colorful chips!"
          gameType="manipulatives"
          difficultyDescriptions={{
            easy: "Numbers up to 5 (recommended for beginners)",
            medium: "Numbers up to 7 (building confidence)",
            hard: "Numbers up to 10 (advanced practice)",
          }}
        />
      </div>
    );
  }

  // Results screen
  if (isSessionComplete) {
    const stats = getGameStats();
    if (!stats) {
      return <div>Error loading results</div>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <GameResults
          stats={stats}
          onRestart={restartSession}
          onNewGame={clearSession}
          gameTitle="Integer Blocks"
          saveSessionResults={saveSessionResults}
        />
      </div>
    );
  }

  // Game play screen
  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <GamePlay
        question={currentQuestion}
        timeRemaining={timeRemaining}
        onAnswer={handleAnswer}
        isPaused={session.isPaused}
        onPause={pauseSession}
        onResume={resumeSession}
        showFeedback={showFeedback}
        feedbackMessage={feedbackMessage}
        isCorrect={isCorrect}
        questionNumber={session.currentQuestionIndex + 1}
        totalQuestions={session.questions.length}
        gameInstructions="What is the total value of the chips?"
      />
    </div>
  );
}

export default ManipulativesGame;
