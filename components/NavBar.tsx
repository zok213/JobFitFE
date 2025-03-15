"use client";

import React from "react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const navLinks = [
    "AI Job Match",
    "AI Resume Assistant",
    "For Employer",
    "About Us",
    "Blog",
  ];

  return (
    <nav className="flex justify-between items-center px-24 py-0 mt-16 max-md:px-12 max-md:py-0">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a370911d3fed194a90a454a7d831bcfa06a644fe"
        alt="Logo"
        className="h-20 w-[157px]"
      />
      <div className="flex gap-10 items-center max-sm:hidden">
        {navLinks.map((link) => (
          <button
            key={link}
            className="text-xl leading-7 text-black cursor-pointer hover:text-gray-700"
          >
            {link}
          </button>
        ))}
        <Button className="px-9 py-5 text-xl font-bold bg-black rounded-2xl text-stone-50 hover:bg-gray-800">
          JOIN NOW
        </Button>
      </div>
    </nav>
  );
};
