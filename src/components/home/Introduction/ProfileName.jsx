import { BadgeCheck, Volume2 } from "lucide-react";

const ProfileName = ({ name }) => {
  const playPronunciation = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const pronunciation = new SpeechSynthesisUtterance(name);
    pronunciation.lang = "en-IN";
    pronunciation.rate = 0.82;
    pronunciation.pitch = 1;
    window.speechSynthesis.speak(pronunciation);
  };

  return (
    <div className="flex items-center gap-1.5">
      <h1
        className="profile-name truncate text-xl leading-tight tracking-[-0.02em] text-[var(--color-text)] sm:text-[30px]"
      >
        {name}
      </h1>

      <BadgeCheck
        aria-label="Verified profile"
        className="size-[18px] shrink-0 fill-[var(--color-text)] text-[var(--color-bg)] sm:size-5"
        strokeWidth={2.5}
      />

      <button
        type="button"
        onClick={playPronunciation}
        aria-label={`Listen to the pronunciation of ${name}`}
        title="Play name pronunciation"
        className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--color-secondary-text)] transition-all duration-200 hover:bg-[var(--color-icons-bg)] hover:text-[var(--color-text)] active:scale-90"
      >
        <Volume2 aria-hidden="true" size={18} />
      </button>
    </div>
  );
};

export default ProfileName;
