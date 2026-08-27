import React, { Suspense, lazy } from "react";
import Introduction from "./../components/Ui/Layouts/Introduction";
import HomeProjects from "../components/Ui/Layouts/HomeProjects";
import HomeAbout from "../components/Ui/Layouts/HomeAbout";
import InfiniteSlider from "../components/Animation/InfiniteSlider";
import SetUpDevlopement from "../components/Ui/Layouts/SetUpDevlopement";

// 🔹 Lazy loaded components
const HomeGitHub = lazy(() => import("../components/Ui/Layouts/HomeGitHub"));
const HomeBlog = lazy(() => import("../components/Ui/Layouts/HomeBlog"));
const HomeBook = lazy(() => import("../components/Ui/Layouts/HomeBook"));

const Home = () => {
  return (
    <div className="max-w-3xl m-auto px-8">
      <Introduction />
      <HomeProjects />
      <HomeAbout />
      <InfiniteSlider />

      {/* 🔹 Lazy-loaded sections */}
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <HomeGitHub />
        <HomeBlog />
        <HomeBook />
      </Suspense>

      <SetUpDevlopement />
    </div>
  );
};

export default Home;
