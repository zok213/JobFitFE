"use client";

import React from "react";
import { ServiceCard } from "./ServiceCard";

export const ServicesSection = () => {
  const services = [
    {
      title: ["Employer", "Dashboard"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/a8ddbbd292be52ea7db59ea8ddc086893b632972",
      variant: "grey",
    },
    {
      title: ["Post a Job"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/f3cd4e0c0fb3298596091fb35b48fb046b1c2468",
      variant: "green",
    },
    {
      title: ["AI Candidate", "Matching"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/4517dafffc49805ba73ea71f47391f85ceb3111a",
      variant: "black",
    },
    {
      title: ["Resume", "Analyzer"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/db026ab47d39bdbdfaac4fd1c4fc3450154a5a2c",
      variant: "grey",
    },
    {
      title: ["Talent Pool"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c61ac0659ba7389575f8161cf26ee804e061cc6d",
      variant: "green",
    },
    {
      title: ["Company Profile"],
      illustration:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0fa0deebf0415a7f57c0bbfb10542001a1cc1909",
      variant: "black",
    },
  ];

  return (
    <section className="flex flex-col gap-10 px-24 py-16 max-md:px-12 max-md:py-0">
      <h2 className="inline-flex items-center px-6 py-3 pr-14 mr-auto text-4xl font-bold text-black whitespace-nowrap bg-lime-300 rounded-2xl">
        For Employer
      </h2>
      <p className="text-lg text-black">
        Helps recruiters find the most suitable candidates faster and smarter
      </p>
      <div className="grid gap-10 grid-cols-[repeat(2,1fr)] max-md:grid-cols-[1fr]">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            illustration={service.illustration}
            variant={service.variant as "grey" | "green" | "black"}
          />
        ))}
      </div>
    </section>
  );
};
