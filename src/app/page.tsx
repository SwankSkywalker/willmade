import React from "react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      {/* Hero section outside the container so it can span full w/h */}
      {/*<HeroSection />*/}

      {/* Main container for rest of page */}
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="flex items-center gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="p-4 mx-auto content-center">Hello Mom :) this site is under construction!</div>
        </div>
      </div>
    </>
  );
}
