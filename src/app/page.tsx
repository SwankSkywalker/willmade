import React from "react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      {/* Hero section outside the container so it can span full w/h */}
      {/*<HeroSection />*/}

      {/* Main container for rest of page */}
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="grid h-svh">
          <p className="p-1 mx-auto place-content-center text-6xl">
            <b><em>Salut!</em></b>< br/>
          </p>
          <p className="p-4 mx-auto content-center h-0">
            Welcome to my little corner of the internet< br/>
            A smorgasbord of creativity, curiosity, and chaos.< br/>
            And as more gets added this section will expand out.
          </p>
        </div>
      </div>
    </>
  );
}
