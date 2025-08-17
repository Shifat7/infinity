import { GameStats } from '@/types/game';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface GameResultPayload {
  child_id: number;
  game_id: number;
  score: number;
  time_taken_seconds: number;
  feedback_data: object;
}

export const sendGameResult = async (result: GameResultPayload) => {
  try {
    // Step 1: Create a new game session
    const sessionResponse = await fetch(`${API_BASE_URL}/game-sessions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        child_id: result.child_id,
        game_id: result.game_id,
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to create game session');
    }

    const session = await sessionResponse.json();
    const session_id = session.session_id;

    // Step 2: Send the game result with the new session ID
    const resultResponse = await fetch(`${API_BASE_URL}/game-results/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        score: result.score,
        time_taken_seconds: result.time_taken_seconds,
        feedback_data: result.feedback_data,
      }),
    });

    if (!resultResponse.ok) {
      throw new Error('Failed to send game result');
    }

    const data = await resultResponse.json();
    console.log('Game result sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending game result:', error);
    throw error;
  }
};

export const getModelRecommendations = async (feedbackText: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/recommendations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackText),
    });

    if (!response.ok) {
      throw new Error('Failed to get model recommendations');
    }

    const data = await response.json();
    console.log('Model recommendations received:', data);
    return data;
  } catch (error) {
    console.error('Error getting model recommendations:', error);
    throw error;
  }
};
