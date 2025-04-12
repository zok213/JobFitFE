"use client";

import React from "react";
import Link from "next/link";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Huỳnh Ngọc Hân",
      role: "Project Manager",
      initials: "HNH",
      linkedin: "#",
    },
    {
      name: "Nguyễn Bắc Bảo Khang",
      role: "Game Developer",
      initials: "NBBK",
      linkedin: "#",
    },
    {
      name: "Nguyễn Xuân Việt",
      role: "AI/ML Engineer",
      initials: "NXV",
      linkedin: "#",
    },
    {
      name: "Nguyễn Lê Khánh An",
      role: "Tech Lead",
      initials: "NLKA",
      linkedin: "#",
    },
    {
      name: "Mai Phước Minh Tài",
      role: "MLOps Engineer",
      initials: "MPMT",
      linkedin: "#",
    },
  ];

  return (
    <section id="team" className="px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto">
      <div className="bg-lime-300 px-4 py-2 rounded-xl w-fit mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Team
        </h2>
      </div>
      <p className="text-base md:text-lg text-black mb-8">
        Meet our skilled and experienced team of professionals
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <article
            key={member.initials}
            className="flex items-center gap-4 p-6 bg-lime-300 rounded-3xl"
          >
            <div className="rounded-full bg-black w-12 h-12 flex items-center justify-center text-lime-300 text-lg font-bold shrink-0">
              {member.initials}
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-medium text-black">
                {member.name}
              </h3>
              <p className="text-sm text-black/80">{member.role}</p>
            </div>
            <Link href={member.linkedin} aria-label={`${member.name}'s LinkedIn profile`} className="ml-auto">
              <div className="rounded-full bg-black p-2 hover:bg-opacity-80 transition-colors">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                    stroke="#B9FF66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="9"
                    width="4"
                    height="12"
                    stroke="#B9FF66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="4"
                    cy="4"
                    r="2"
                    stroke="#B9FF66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
