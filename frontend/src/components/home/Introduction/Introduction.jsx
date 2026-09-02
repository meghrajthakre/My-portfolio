import SocialMediaicons from "../../Ui/SocialMediaicons";
import ProfileHeader from "./ProfileHeader";
import { StaggerItem, StaggerReveal } from "../../Animation/StaggerReveal";

const Introduction = () => (
  <section className="mx-auto max-w-3xl py-12 text-left sm:py-15">
    <ProfileHeader />

    <div className="relative mt-8 py-5">
      <StaggerReveal className="pointer-events-none absolute right-[calc(100%+3rem)] top-1/2 hidden -translate-y-1/2 lg:block" delay={0.08}>
        <StaggerItem>
          <p
            className="w-20 -rotate-33 text-center text-lg font-semibold leading-none text-[var(--color-secondary-text)]"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            follow me
          </p>
        </StaggerItem>
        <StaggerItem>
          <svg aria-hidden="true" viewBox="0 0 90 44" className="-mt-5 h-15 w-20 translate-x-10 text-[var(--color-secondary-text)]">
          <path
            d="M10 4c-2 14 3 24 15 28 10 3 22 1 32-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="m48 24 10 3-4 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          </svg>
        </StaggerItem>
      </StaggerReveal>

      <div className="flex min-w-0 items-center">
        <SocialMediaicons />
      </div>
    </div>
  </section>
);

export default Introduction;
