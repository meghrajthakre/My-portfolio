const COPY_SOUND_PATH = "/audio/computer-mouse-click-352734.mp3";

export const playCopySound = () => {
  const audio = new Audio(COPY_SOUND_PATH);
  audio.volume = 0.35;
  audio.play().catch(() => {});
};
