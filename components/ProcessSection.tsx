"use client";

import React, { useState } from "react";

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      number: "01",
      title: "Job & CV Submission",
      description: "Candidates upload CVs, and employers post job listings.",
    },
    { number: "02", title: "AI Matching & Analysis" },
    { number: "03", title: "Skill Enhancement Suggestions" },
    { number: "04", title: "Employer Review & Shortlisting" },
    { number: "05", title: "Seamless Hiring & Collaboration" },
  ];

  return (
    <section className="px-24 py-0 mx-0 my-16 max-md:px-12 max-md:py-0">
      <h2 className="inline-block px-2 py-0 text-4xl font-bold text-black bg-lime-300 rounded-lg mb-8">
        Our Working Process
      </h2>
      <div className="flex flex-col gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2.5 items-start px-16 py-10 border border-solid shadow-sm bg-zinc-100 border-zinc-900 rounded-[45px] w-[1234px] max-sm:p-8 max-sm:w-full ${
              activeStep === index + 1 ? "bg-zinc-100" : ""
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-6 items-center">
                <span className="text-6xl font-medium text-black">
                  {step.number}
                </span>
                <h3 className="text-3xl font-medium text-black">
                  {step.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveStep(index + 1)}
                className="w-[58px] h-[59px] rounded-full bg-[#F3F3F3] border border-[#191A23] flex items-center justify-center"
              >
                {activeStep === index + 1 ? "-" : "+"}
              </button>
            </div>
            {activeStep === index + 1 && step.description && (
              <>
                <div className="h-px bg-black w-[1114px]" />
                <p className="text-lg text-black">{step.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
