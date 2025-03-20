"use client";

import React from "react";
import { CVEditor } from "@/components/ai-cv-assistant/CVEditor";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CVEditorPage() {
  const router = useRouter();

  return (
    <DashboardShell activeNavItem="cv-assistant">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600 hover:text-black"
              onClick={() => router.push("/cv-assistant")}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">CV Editor</h1>
          <p className="text-gray-600">
            Create or edit your CV with our structured editor. We'll help you organize your information
            and format it professionally.
          </p>
        </div>

        <CVEditor />
      </div>
    </DashboardShell>
  );
} 