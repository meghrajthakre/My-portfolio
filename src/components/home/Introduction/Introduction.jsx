import SocialMediaicons from "../../Ui/SocialMediaicons";
import ProfileHeader from "./ProfileHeader";

const Introduction = () => (
  <section className="mx-auto max-w-3xl py-12 text-left sm:py-15">
    <ProfileHeader />

    <div className="relative mt-8  py-5">
      <div className="hidden w-24 shrink-0 lg:absolute lg:right-full lg:top-[-18px] lg:mr-2 lg:block">
        <p
          className="-rotate-15 font-bold text-center text-base italic text-[var(--color-secondary-text)]"
          style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
        >
          follow me
        </p>
        <svg aria-hidden="true" viewBox="0 0 72 46" className="ml-auto h-8 w-14 text-[var(--color-secondary-text)]">
          <path d="M8 2c2 18 13 30 36 33h14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="m51 29 8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex min-w-0 items-center ">
        <SocialMediaicons />
      </div>
    </div>
  </section>
);

export default Introduction;
