import React from "react";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <>
      {/* Hero section outside the container so it can span full w/h */}
      {/*<HeroSection />*/}

      {/* Main container for rest of page */}
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="grid place-items-center h-screen">
          <p className="p-4 mx-auto content-center"><b>Salut!</b>
            <p>Welcome to my little corner of the internet</p> <p>A smorgasbord of creativity, curiosity, and chaos.</p> </p>
        </div>
      </div>
    </>
  );
}
