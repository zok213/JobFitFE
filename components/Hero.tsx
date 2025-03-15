"use client";

import React from "react";
import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <section className="flex flex-col gap-16 px-24 py-0 max-md:px-12 max-md:py-0">
      <div className="flex justify-between items-start max-sm:flex-col max-sm:items-center max-sm:text-center">
        <div className="flex flex-col gap-9 max-w-[681px]">
          <h1 className="text-6xl font-medium text-black max-sm:pt-8 max-sm:mb-0">
            Job Search Stress? Let AI Do the Rest!
          </h1>
          <p className="text-xl leading-7 text-black">
            Finding the right job or the perfect candidate has never been
            easier! Our AI-powered platform helps job seekers match with the
            best opportunities, optimize their CVs, and identify skill gaps for
            career growth. Employers can streamline hiring with smart candidate
            recommendations and AI-driven resume analysis. Whether you're a
            freelancer, a job seeker, or a recruiter, our intelligent system
            ensures a faster, smarter, and more efficient job search experience.
            Let AI take the stress out of job hunting!
          </p>
          <Button className="px-9 py-5 text-xl text-lime-300 rounded-2xl bg-zinc-900 w-fit hover:bg-zinc-800">
            Let's Match
          </Button>
        </div>
        <div className="header-illustration">
          {/* SVG illustration from the design */}
          <svg
            width="570"
            height="510"
            viewBox="0 0 570 510"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="header-illustration"
          >
            <g clipPath="url(#clip0_463_3710)">
              <path
                d="M404.804 79.7538C404.889 81.2706 404.932 82.7874 405.017 84.2552C405.017 84.5488 405.188 84.9402 405.486 84.9402C441.372 90.6158 477.557 85.8209 513.571 85.9187C523.757 85.9187 533.9 86.3591 544.044 87.4844C544.3 87.5334 544.598 87.2398 544.641 86.9462C544.982 84.9402 545.365 82.9341 545.706 80.9281C545.877 79.9985 544.641 79.607 544.47 80.5367C544.129 82.5427 543.746 84.5488 543.405 86.5548C543.618 86.3591 543.831 86.2123 544.001 86.0166C508.328 82.0045 472.527 87.0441 436.769 86.1634C426.413 85.9187 416.056 85.1359 405.784 83.5213C405.955 83.7659 406.083 84.0106 406.253 84.2063C406.168 82.6895 406.125 81.1727 406.04 79.7049C406.04 78.8242 404.762 78.8242 404.804 79.7538Z"
                fill="#C8CCD1"
              />
              <path
                d="M405.869 80.4877C441.926 80.4877 478.025 80.4877 514.082 80.4877C524.311 80.4877 534.539 80.4877 544.768 80.4877C545.578 80.4877 545.578 79.0199 544.768 79.0199C508.712 79.0199 472.613 79.0199 436.556 79.0199C426.327 79.0199 416.098 79.0199 405.869 79.0199C405.06 79.0199 405.06 80.4877 405.869 80.4877Z"
                fill="#C8CCD1"
              />
              {/* Add all the SVG paths here */}
              <path
                d="M307.972 136.706C308.398 141.941 309.166 149.28 310.87 157.941C311.979 163.567 312.66 167.139 314.11 171.591C316.283 178.295 320.417 191.114 331.2 199.48C333.8 201.535 338.105 204.275 344.157 205.89C345.137 205.988 346.117 206.134 347.097 206.232C347.438 208.287 347.865 211.321 348.291 214.99C349.314 224.434 348.802 227.32 350.933 229.865C353.533 232.947 357.667 232.653 358.562 232.556C365.68 232.017 369.26 223.895 369.43 223.455C368.28 221.057 367.129 218.122 366.191 214.697C364.145 207.113 364.103 200.361 364.444 195.762C367.725 190.331 371.348 186.172 375.014 182.943C376.42 181.719 377.613 180.056 379.702 179.224C382.685 178.05 384.219 179.224 386.436 178.441C390.101 177.12 391.678 171.689 392.36 169.439C394.96 160.534 391.763 151.727 389.717 146.491C387.885 141.696 383.111 129.807 371.476 120.511C359.5 110.921 335.547 100.255 319.693 114.101C316.965 116.499 310.743 122.908 307.972 136.706Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_463_3710">
                <rect
                  width="570"
                  height="509"
                  fill="white"
                  transform="translate(0 0.731812)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};
