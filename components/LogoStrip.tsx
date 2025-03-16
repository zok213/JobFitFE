"use client";

import Image from "next/image";

export const LogoStrip = () => {
    const logos = [
      {
        src: "/img/careerbuilder.png",
        alt: "Careerbuilder Logo",
      },
      {
        src: "/img/indeed.png",
        alt: "Indeed Logo",
      },
      {
        src: "/img/vieclam24h.png",
        alt: "Vieclam24h Logo",
      },
      {
        src: "/img/yboxvn.png",
        alt: "Ybox Logo",
      },
      {
        src: "/img/careerlink.png",
        alt: "Careerlink Logo",
      },
      {
        src: "/img/careerviet.png",
        alt: "Careerviet Logo",
      },
    ];
  
    return (
      <section className="py-12 px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto overflow-hidden">
        <h2 className="text-center text-zinc-500 text-sm font-medium mb-8 uppercase tracking-wider">Trusted by leading job platforms</h2>
        <div className="flex justify-around items-center flex-wrap gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="relative grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={40}
                className="object-contain max-h-[40px] w-auto"
              />
            </div>
          ))}
        </div>
      </section>
    );
  };
  