"use client";

import React, { useState } from "react";

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: "01",
      title: "Job & CV Submission",
      description: "Candidates upload CVs, and employers post job listings. Our AI-powered system begins analyzing each submission for optimal matching.",
    },
    { 
      number: "02", 
      title: "AI Matching & Analysis",
      description: "Our advanced algorithms analyze job descriptions and candidate profiles to identify the most promising matches based on skills, experience, and other factors.",
    },
    { 
      number: "03", 
      title: "Skill Enhancement Suggestions",
      description: "Candidates receive personalized feedback on their profiles with suggestions for skills to develop to become more competitive for desired positions.",
    },
    { 
      number: "04", 
      title: "Employer Review & Shortlisting",
      description: "Employers review AI-recommended candidates, with each profile presented alongside a compatibility score and key qualification highlights.",
    },
    { 
      number: "05", 
      title: "Seamless Hiring & Collaboration",
      description: "Once a match is confirmed, our platform facilitates the interview scheduling, offer negotiation, and onboarding process with integrated tools.",
    },
  ];

  const toggleStep = (stepIndex: number) => {
    setActiveStep(activeStep === stepIndex ? 0 : stepIndex);
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto">
      <div className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Our Working Process
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = activeStep === stepNumber;
          
          return (
            <div
              key={index}
              className={`transition-all duration-200 rounded-3xl overflow-hidden border ${
                isActive 
                  ? "bg-lime-300 border-black" 
                  : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div 
                className="flex justify-between items-center w-full px-6 py-4 cursor-pointer"
                onClick={() => toggleStep(stepNumber)}
              >
                <div className="flex gap-4 items-center">
                  <span className="text-2xl md:text-3xl font-medium text-black min-w-[32px]">
                    {step.number}
                  </span>
                  <h3 className="text-base md:text-xl font-medium text-black">
                    {step.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep(stepNumber);
                  }}
                  className={`w-8 h-8 rounded-full ${isActive ? "bg-black text-lime-300" : "bg-gray-100"} flex items-center justify-center transition-colors`}
                  aria-label={isActive ? "Collapse step details" : "Expand step details"}
                >
                  <span aria-hidden="true" className="text-lg leading-none">{isActive ? "-" : "+"}</span>
                </button>
              </div>
              
              {isActive && (
                <div className="px-6 pb-5 text-sm md:text-base text-black/80">
                  {step.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
