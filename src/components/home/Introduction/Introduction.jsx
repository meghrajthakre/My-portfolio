import DownloadButton from "../../Ui/DownloadButton";
import GetInTouchButton from "../../Ui/GetInTouchButton";
import SocialMediaicons from "../../Ui/SocialMediaicons";
import ProfileHeader from "./ProfileHeader";

const Introduction = () => (
  <section className="mx-auto max-w-3xl py-12 text-left sm:py-15">
    <ProfileHeader />

    <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row">
      <DownloadButton />
      <GetInTouchButton />
    </div>

    <div className="pt-7">
      <SocialMediaicons />
    </div>
  </section>
);

export default Introduction;
