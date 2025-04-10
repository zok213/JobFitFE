"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { CVAnalysis } from "@/components/ai-cv-assistant/CVAnalysis";

export default function CVAnalysisPage() {
  return (
    <DashboardShell activeNavItem="cvassistant" userRole="employee">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">CV Analysis</h1>
          <p className="text-gray-500 mt-1">Review your CV analysis and get suggestions for improvement</p>
        </div>
        
        <CVAnalysis />
      </div>
    </DashboardShell>
  );
} 