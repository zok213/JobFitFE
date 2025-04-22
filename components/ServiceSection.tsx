"use client";

import React from "react";
import { ServiceCard } from "./ServiceCard";

export const ServicesSection = () => {
  const employerServices = [
    {
      title: "Employer Dashboard",
      description: "Manage all your hiring activities in one place",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=Employer+Dashboard",
      variant: "grey",
    },
    {
      title: "Post a Job",
      description: "Create and publish job listings with AI optimization",
      illustration: "https://placehold.co/600x400/eee/31343C?text=Post+a+Job",
      variant: "green",
    },
    {
      title: "AI Candidate Matching",
      description: "Find perfect matches with our smart algorithms",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=AI+Candidate+Matching",
      variant: "black",
    },
    {
      title: "Resume Analyzer",
      description: "Evaluate candidate qualifications with AI precision",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=Resume+Analyzer",
      variant: "grey",
    },
    {
      title: "Talent Pool",
      description: "Maintain a database of qualified candidates",
      illustration: "https://placehold.co/600x400/eee/31343C?text=Talent+Pool",
      variant: "green",
    },
    {
      title: "Company Profile",
      description: "Showcase your employer brand to attract talent",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=Company+Profile",
      variant: "black",
    },
  ];

  const jobSeekerServices = [
    {
      title: "AI Job Match",
      description: "Find your perfect job with AI-powered matching",
      illustration: "https://placehold.co/600x400/eee/31343C?text=AI+Job+Match",
      variant: "black",
    },
    {
      title: "Resume Assistant",
      description: "Optimize your CV to stand out to employers",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=Resume+Assistant",
      variant: "grey",
    },
    {
      title: "AI Interviewer",
      description: "Practice interviews with AI feedback",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=AI+Interviewer",
      variant: "green",
    },
    {
      title: "Career Roadmap",
      description: "Plan your career path with personalized guidance",
      illustration:
        "https://placehold.co/600x400/eee/31343C?text=Career+Roadmap",
      variant: "black",
    },
  ];

  return (
    <>
      <section
        id="for-job-seeker"
        className="flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto"
      >
        <div className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            For Job Seeker
          </h2>
        </div>
        <p className="text-base md:text-lg text-black mb-6">
          Powerful AI tools to help you find and land your dream job
        </p>
        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          {jobSeekerServices.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              illustration={service.illustration}
              variant={service.variant as "grey" | "green" | "black"}
            />
          ))}
        </div>
      </section>

      <section
        id="for-employer"
        className="flex flex-col gap-6 px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto"
      >
        <div className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            For Employer
          </h2>
        </div>
        <p className="text-base md:text-lg text-black mb-6">
          Helps recruiters find the most suitable candidates faster and smarter
        </p>
        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          {employerServices.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              illustration={service.illustration}
              variant={service.variant as "grey" | "green" | "black"}
            />
          ))}
        </div>
      </section>
    </>
  );
};
