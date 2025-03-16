"use client";

import React from "react";
import { Navbar } from "./NavBar";
import { Hero } from "./Hero";
import { LogoStrip } from "./LogoStrip";
import { ServicesSection } from "./ServiceSection";
import { ColleagueFinderSection } from "./ColleagueFinderSection";
import { BlogSection } from "./BlogSection";
import { ProcessSection } from "./ProcessSection";
import { TeamSection } from "./TeamSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <LogoStrip />
      <ServicesSection />
      <ColleagueFinderSection />
      <BlogSection />
      <ProcessSection />
      <TeamSection />
      <ContactSection />
      <Footer />
    </main>
  );
};
