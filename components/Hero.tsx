"use client";

import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="flex flex-col px-6 md:px-12 lg:px-24 py-8 md:py-12 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-center max-md:flex-col max-md:items-start">
        <div className="flex flex-col gap-6 max-w-[600px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-tight">
            Job Search Stress? Let AI Do the Rest!
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-black">
            Finding the right job or the perfect candidate has never been
            easier! Our AI-powered platform helps job seekers match with the
            best opportunities, optimize their CVs, and identify skill gaps for
            career growth.
          </p>
          {user ? (
            <Link href="/dashboard">
              <Button className="px-8 py-4 text-base font-bold text-black rounded-xl bg-lime-300 w-fit hover:bg-lime-200 transition-all shadow-md">
                GO TO DASHBOARD
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button className="px-8 py-4 text-base font-bold text-black rounded-xl bg-lime-300 w-fit hover:bg-lime-200 transition-all shadow-md">
                LET'S MATCH
              </Button>
            </Link>
          )}
        </div>
        <div className="hero-illustration mt-8 md:mt-0">
          <Image
            src="/img/hero.png"
            alt="Person working with AI job matching"
            width={500}
            height={450}
            className="w-full h-auto object-contain max-w-[500px]"
            priority
          />
        </div>
      </div>
    </section>
  );
};
