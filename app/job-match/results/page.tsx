"use client";

import { DashboardShell } from "@/components/DashboardShell";
import { MatchResults } from "@/components/ai-job-match/MatchResults";
import { JobMatchLayout } from "@/components/ai-job-match/JobMatchLayout";

export default function ResultsPage() {
  return (
    <DashboardShell activeNavItem="job-match" userRole="employee">
      <JobMatchLayout>
        <MatchResults />
      </JobMatchLayout>
    </DashboardShell>
  );
} 