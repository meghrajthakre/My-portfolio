let audioContext;

export const preloadCopySound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext ??= new AudioContext();
};

export const playCopySound = () => {
  preloadCopySound();
  if (!audioContext) return;

  const playTone = (frequency, startTime, duration, volume) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, startTime + duration);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const startTime = audioContext.currentTime;
  if (audioContext.state === "suspended") audioContext.resume();
  playTone(660, startTime, 0.09, 0.12);
  playTone(990, startTime + 0.055, 0.14, 0.14);
};
