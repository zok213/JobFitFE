"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const BlogSection = () => {
  const blogPosts = [
    {
      title: "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills",
      content:
        "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills, experience, and preferences to recommend the most relevant job opportunities. Instead of scrolling through thousands of listings, AI does the heavy lifting for you.",
    },
    {
      title: "Many candidates struggle with writing a strong resume. AI-powered tools analyze job descriptions",
      content:
        "Many candidates struggle with writing a strong resume. AI-powered tools analyze job descriptions and provide real-time suggestions to optimize wording, formatting, and keyword usage—helping applicants stand out.",
    },
    {
      title: "Recruiters no longer have to sift through piles of resumes. AI automatically screens applications",
      content:
        "Recruiters no longer have to sift through piles of resumes. AI automatically screens applications, matches the best-fit candidates, and even analyzes past hiring data to predict the best hires—saving time and improving hiring success rates.",
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
            className={`flex flex-col h-full ${
              index !== 0 ? "md:border-l md:border-lime-300/30 md:pl-8" : ""
            } ${index !== 0 && "pt-6 border-t border-lime-300/30 md:pt-0 md:border-t-0"}`}
          >
            <div>
              <p className="text-lime-300 font-medium text-sm mb-4 leading-relaxed">{post.title}</p>
              <p className="text-xs text-gray-300 mb-6 leading-relaxed">{post.content}</p>
            </div>
          </article>
        ))}
      </div>
      
      {/* Single Learn More button */}
      <div className="flex justify-center mt-8">
        <Link href="/blog">
          <Button className="bg-lime-300 hover:bg-lime-400 text-zinc-900 font-medium">
            Learn more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};