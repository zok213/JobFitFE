"use client";

import React from 'react';
import Link from 'next/link';

export const BlogSection = () => {
  const blogPosts = [
    {
      title: "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills",
      content:
        "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills, experience, and preferences to recommend the most relevant job opportunities. Instead of scrolling through thousands of listings, AI does the heavy lifting for you.",
      link: "#"
    },
    {
      title: "Many candidates struggle with writing a strong resume. AI-powered tools analyze job descriptions",
      content:
        "Many candidates struggle with writing a strong resume. AI-powered tools analyze job descriptions and provide real-time suggestions to optimize wording, formatting, and keyword usage—helping applicants stand out.",
      link: "#"
    },
    {
      title: "Recruiters no longer have to sift through piles of resumes. AI automatically screens applications",
      content:
        "Recruiters no longer have to sift through piles of resumes. AI automatically screens applications, matches the best-fit candidates, and even analyzes past hiring data to predict the best hires—saving time and improving hiring success rates.",
      link: "#"
    },
  ];

  return (
    <section id="blog" className="px-6 md:px-12 lg:px-24 py-16 max-w-[1440px] mx-auto">
      <div className="bg-lime-300 py-2 px-4 rounded-xl inline-block mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black">
          Blog
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-zinc-900 rounded-3xl p-8 md:p-12">
        {blogPosts.map((post, index) => (
          <article 
            key={index} 
            className={`flex flex-col justify-between h-full ${
              index !== 0 ? "md:border-l md:border-lime-300/30 md:pl-8" : ""
            } ${index !== 0 && "pt-6 border-t border-lime-300/30 md:pt-0 md:border-t-0"}`}
          >
            <div>
              <p className="text-lime-300 font-medium text-sm mb-4 leading-relaxed">{post.title}</p>
              <p className="text-xs text-gray-300 mb-6 leading-relaxed">{post.content}</p>
            </div>
            <Link 
              href={post.link}
              className="flex items-center gap-2 text-lime-300 hover:underline group w-fit"
            >
              <span className="text-sm">Learn more</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform group-hover:translate-x-1"
              >
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};