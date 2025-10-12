/**
 * Plays an alert sound using Web Audio API
 * Creates a beeping sound pattern to alert caregivers
 */
export const playAlertSound = (): void => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playBeep = (frequency: number, duration: number, delay: number): void => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }, delay);
  };
  
  // Play three beeps in sequence
  playBeep(800, 0.15, 0);
  playBeep(800, 0.15, 200);
  playBeep(800, 0.15, 400);
};

