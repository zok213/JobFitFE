"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { CareerRoadmap } from "@/components/ai-roadmap/CareerRoadmap";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { LinkButton } from "@/components/LinkButton";

export default function RoadmapDetailsPage() {
  const router = useRouter();

  return (
    <DashboardShell activeNavItem="roadmap">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Career Roadmap</h1>
            <p className="text-gray-500 mt-1">
              Personalized development path based on your skills and career goals
            </p>
          </div>
          
          <LinkButton 
            variant="outline" 
            href="/roadmap"
            className="flex items-center gap-2 max-w-max hover:bg-gray-50 hover:border-gray-300 transition-all"
            icon={<ArrowLeft className="h-4 w-4" />}
            aria-label="Return to roadmap paths page"
          >
            Back to Paths
          </LinkButton>
        </div>
        
        <CareerRoadmap />
      </div>
    </DashboardShell>
  );
} 