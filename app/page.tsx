import { Hero } from "@/components/sections/hero";
import { Introduction } from "@/components/sections/introduction";
import { ProjectsExpandable } from "@/components/sections/projects-expandable";
import { ExperienceIndiaMap } from "@/components/sections/experience-india-map";
import { PostcardSection } from "@/components/sections/postcard-coffee";
import { GlobePostcardSection } from "@/components/sections/globe-postcard-section";
import { PostcardJourneySection } from
  "@/components/sections/PostcardJourneySection";

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <ProjectsExpandable />
      <ExperienceIndiaMap />
      {/* <PostcardSection /> */}
      <PostcardJourneySection />
      {/* <GlobePostcardSection /> */}
    </>
  );
}