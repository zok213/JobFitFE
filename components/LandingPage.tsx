"use client";

import React from "react";
import { Navbar } from "./NavBar";
import { Hero } from "./Hero";
import { LogoStrip } from "./LogoStrip";
import { ServicesSection } from "./ServiceSection";
import { ColleagueFinderSection } from "./ColleagueFinderSection";
import { BlogSection } from "./BlogSection";
import { ProcessSection } from "./ProcessSection";
import { TeamSection } from "./TeamSection";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { ArrowRight, Star, Award, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { ChatWidget } from "./ui/chat-widget";
import Image from "next/image";

export const LandingPage = () => {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Testimonial/Social Proof Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-slate-50 border-y border-slate-100 py-4 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <p className="text-slate-700 font-medium">
              Rated 4.8/5 from over 1,200+ reviews
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Badge variant="outline" className="bg-white">
              Data Privacy Compliant
            </Badge>
            <Badge variant="outline" className="bg-white">
              GDPR Certified
            </Badge>
            <Badge variant="outline" className="bg-white">
              ISO 27001 Certified
            </Badge>
            <Badge variant="outline" className="bg-white">
              SOC 2 Compliant
            </Badge>
          </div>
        </div>
      </motion.section>

      <LogoStrip />

      <ServicesSection />
      <ColleagueFinderSection />

      {/* Enhanced Call-to-Action Banner */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-black to-gray-900 py-20 px-6 overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-32 h-32 bg-lime-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-white max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            >
              Ready to accelerate your career journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 text-lg mb-8"
            >
              Join thousands of professionals who've found their dream job with
              JobFit.AI's intelligent matching technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-lime-300 to-lime-400 text-black hover:from-lime-200 hover:to-lime-300 font-medium shadow-xl hover:shadow-lime-400/20 transition-all hover:-translate-y-0.5 duration-300"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/50 text-lime-300 hover:bg-white hover:border-white hover:text-black backdrop-blur-sm shadow-lg hover:shadow-lime-400/30 hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
                >
                  LOG IN
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 text-white shadow-2xl w-full md:w-auto md:min-w-[350px]"
          >
            <h3 className="font-bold text-xl mb-6 flex items-center">
              <Award className="text-lime-300 mr-2 h-5 w-5" />
              JobFit.AI by the numbers
            </h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    93%
                  </p>
                  <p className="text-gray-400">match accuracy</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    10,000+
                  </p>
                  <p className="text-gray-400">successful placements</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-lime-300/20 rounded-full flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-lime-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-lime-400">
                    4.8/5
                  </p>
                  <p className="text-gray-400">user satisfaction</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ProcessSection />
      <BlogSection />
      <TeamSection />
      <Footer />

      <ChatWidget
        title="JobFit Assistant"
        subtitle="Trợ lý AI hỗ trợ tìm việc và phân tích CV"
        inputPlaceholder="Hỏi tôi về cơ hội nghề nghiệp..."
      />
    </main>
  );
};
