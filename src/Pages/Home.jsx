import React, { Suspense, lazy } from "react";
import Introduction from "../components/home/Introduction";
import HomeProjects from "../components/Ui/Layouts/HomeProjects";
import HomeAbout from "../components/Ui/Layouts/HomeAbout";
import InfiniteSlider from "../components/Animation/InfiniteSlider";
import SetUpDevlopement from "../components/Ui/Layouts/SetUpDevlopement";
import GitHubActivitySkeleton from "../components/Loader/GitHubActivitySkeleton";
import ScrollReveal from "../components/Animation/ScrollReveal";

// 🔹 Lazy loaded components
const HomeGitHub = lazy(() => import("../components/Ui/Layouts/HomeGitHub"));
const HomeBlog = lazy(() => import("../components/Ui/Layouts/HomeBlog"));
const HomeBook = lazy(() => import("../components/Ui/Layouts/HomeBook"));

const Home = () => {
  return (
    <div className="max-w-3xl m-auto px-8">
      <Introduction />
      <ScrollReveal>
        <Suspense fallback={<GitHubActivitySkeleton section />}>
          <HomeGitHub />
        </Suspense>
      </ScrollReveal>
      <ScrollReveal><HomeProjects /></ScrollReveal>
      <ScrollReveal><HomeAbout /></ScrollReveal>
      <ScrollReveal><InfiniteSlider /></ScrollReveal>

      {/* 🔹 Lazy-loaded sections */}
      <ScrollReveal>
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <HomeBlog />
          <HomeBook />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal><SetUpDevlopement /></ScrollReveal>
    </div>
  );
};

export default Home;
