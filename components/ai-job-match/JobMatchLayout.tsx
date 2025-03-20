"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FileText, FileCheck, Building, CheckCircle, Upload } from "lucide-react";

export interface JobMatchLayoutProps {
  children: React.ReactNode;
}

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
}

export function JobMatchLayout({ children }: JobMatchLayoutProps) {
  const pathname = usePathname();
  
  const steps = [
    {
      id: 1,
      path: "/job-match",
      title: "Job Requirements",
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 2,
      path: "/job-match/upload-cv",
      title: "Upload CV",
      icon: <Upload className="h-5 w-5" />
    },
    {
      id: 3,
      path: "/job-match/results",
      title: "Results",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const currentStepIndex = steps.findIndex(step => 
    pathname === step.path || 
    (pathname.includes(step.path) && step.path !== "/job-match")
  );
  const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 1;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight">AI Job Match</h1>
        <p className="text-gray-500 mt-1">Find the perfect job match using AI</p>
      </div>
      
      {pathname !== "/job-match/results" && (
        <div className="mb-10">
          <div className="hidden md:flex items-center mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepIndicator
                  stepNumber={step.id}
                  title={step.title}
                  isActive={currentStep === step.id}
                  isCompleted={currentStep > step.id}
                  icon={step.icon}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 ${
                      currentStep > index + 1 ? "bg-lime-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex md:hidden mb-8">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Step {currentStep} of {steps.length}:</span>
              <span className="text-black font-medium">
                {steps[currentStepIndex]?.title || steps[0].title}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}

function StepIndicator({ stepNumber, title, isActive, isCompleted, icon }: StepIndicatorProps) {
  return (
    <div className="flex items-center">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          isActive
            ? "bg-lime-300 text-black"
            : isCompleted
            ? "bg-black text-lime-300"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {isCompleted ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          icon
        )}
      </div>
      <span
        className={`ml-2 text-sm font-medium ${
          isActive
            ? "text-black"
            : isCompleted
            ? "text-gray-900"
            : "text-gray-500"
        }`}
      >
        {title}
      </span>
    </div>
  );
} 