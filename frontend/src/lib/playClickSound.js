let audioContext;

export const playClickSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  audioContext ??= new AudioContext();
  const duration = 0.08;
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    const time = index / audioContext.sampleRate;
    const click = Math.sin(2 * Math.PI * 800 * time) * Math.exp(-time * 50);
    const body = Math.sin(2 * Math.PI * 400 * time) * Math.exp(-time * 30) * 0.3;
    data[index] = (click + body) * 0.7;
  }

  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(0.25, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  source.connect(gain);
  gain.connect(audioContext.destination);
  source.start(audioContext.currentTime);
};
