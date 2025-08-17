// Audio utility for accessibility and feedback
interface CustomWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

class AudioManager {
  private audioEnabled: boolean = false;
  private context: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      const AudioContext = window.AudioContext || (window as CustomWindow).webkitAudioContext;
      this.context = new AudioContext();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  setEnabled(enabled: boolean) {
    this.audioEnabled = enabled;
  }

  private createBeep(frequency: number, duration: number, volume: number = 0.3): Promise<void> {
    return new Promise((resolve) => {
      if (!this.context || !this.audioEnabled) {
        resolve();
        return;
      }

      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.context.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);

      oscillator.start(this.context.currentTime);
      oscillator.stop(this.context.currentTime + duration);

      oscillator.onended = () => resolve();
    });
  }

  async playCorrect() {
    // Pleasant ascending chime for correct answers
    await this.createBeep(523.25, 0.2, 0.4); // C5
    await this.createBeep(659.25, 0.2, 0.4); // E5
    await this.createBeep(783.99, 0.3, 0.4); // G5
  }

  async playIncorrect() {
    // Gentle, non-punitive tone for incorrect answers
    await this.createBeep(311.13, 0.4, 0.3); // E♭4 - softer, encouraging
  }

  async playGameStart() {
    // Uplifting game start sound
    await this.createBeep(440, 0.15, 0.3); // A4
    await this.createBeep(554.37, 0.15, 0.3); // C#5
    await this.createBeep(659.25, 0.25, 0.3); // E5
  }

  async playTick() {
    // Subtle timer tick
    await this.createBeep(800, 0.1, 0.2);
  }

  async playTimeWarning() {
    // Gentle warning when time is running low
    await this.createBeep(600, 0.2, 0.25);
    await this.createBeep(600, 0.2, 0.25);
  }
}

const audioManager = new AudioManager();

export const playSound = async (soundType: string) => {
  switch (soundType) {
    case 'correct':
      await audioManager.playCorrect();
      break;
    case 'incorrect':
      await audioManager.playIncorrect();
      break;
    case 'gameStart':
      await audioManager.playGameStart();
      break;
    case 'tick':
      await audioManager.playTick();
      break;
    case 'timeWarning':
      await audioManager.playTimeWarning();
      break;
  }
};

export const setAudioEnabled = (enabled: boolean) => {
  audioManager.setEnabled(enabled);
};

// Speak text using Web Speech API for additional accessibility
export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.7;
    speechSynthesis.speak(utterance);
  }
};
