"use client";

import React from "react";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  illustration: string;
  variant: "grey" | "green" | "black";
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  illustration,
  variant,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "black":
        return "bg-zinc-900 text-lime-300";
      case "green":
        return "bg-lime-300";
      default:
        return "bg-white border border-solid border-zinc-200";
    }
  };

  return (
    <article
      className={`flex flex-col md:flex-row justify-between gap-4 p-6 rounded-[24px] ${getVariantStyles()} h-full`}
    >
      <div className="flex flex-col gap-4 md:gap-6 flex-1">
        <div className="flex flex-col">
          <h3 className={`text-xl font-medium ${variant === "black" ? "text-lime-300" : "text-black"}`}>
            {title}
          </h3>
          <p className={`text-sm mt-2 ${variant === "black" ? "text-lime-300/80" : "text-black/80"}`}>
            {description}
          </p>
        </div>
        <button className="flex items-center gap-2 group w-fit">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-black group-hover:bg-opacity-80 transition-colors flex items-center justify-center">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`text-${variant === "black" ? "lime-300" : "lime-300"}`}
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className={`text-sm ${variant === "black" ? "text-lime-300" : "text-black"} group-hover:underline`}>
            Learn more
          </span>
        </button>
      </div>
      <div className="relative h-[120px] w-[120px] md:h-[140px] md:w-[140px] mt-4 md:mt-0 ml-auto">
        <Image
          src={illustration}
          alt={`${title} illustration`}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 120px, 140px"
        />
      </div>
    </article>
  );
};
