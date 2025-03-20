"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";
import { EnterJobDescription } from "@/components/ai-job-match/EnterJobDescription";

export default function JobMatchPage() {
  return (
    <DashboardShell activeNavItem="job-match">
      <JobMatchLayout>
        <EnterJobDescription />
      </JobMatchLayout>
    </DashboardShell>
  );
} 