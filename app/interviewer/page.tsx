"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { MessageSquare, Briefcase, Clock, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InterviewerPage() {
  const router = useRouter();
  
  const interviewTypes = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Practice technical questions for software development, data science, and other technical roles",
      icon: <Zap className="h-6 w-6 text-black" />,
      duration: "30-45 min",
      color: "bg-lime-100 border-lime-200"
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "Practice common behavioral questions to showcase your soft skills and past experiences",
      icon: <MessageSquare className="h-6 w-6 text-black" />,
      duration: "20-30 min",
      color: "bg-lime-100 border-lime-200"
    },
    {
      id: "rolespecific",
      title: "Role-Specific Interview",
      description: "Tailored interview practice for specific job roles like marketing, finance, or management",
      icon: <Briefcase className="h-6 w-6 text-black" />,
      duration: "25-40 min",
      color: "bg-lime-100 border-lime-200"
    }
  ];

  const handleStartInterview = (type: string) => {
    router.push(`/interviewer/chat?type=${type}`);
  };

  return (
    <DashboardShell activeNavItem="interviewer" userRole="employee">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">AI Interviewer</h1>
          <p className="text-gray-500 mt-1">Practice interviews with AI and get feedback</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Practice Makes Perfect</h2>
              <p className="text-gray-500">Select an interview type to start practicing</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewTypes.map((type) => (
              <div 
                key={type.id}
                className={`border rounded-lg p-6 transition-all hover:shadow-md ${type.color}`}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{type.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{type.duration}</span>
                    </div>
                    <Button 
                      onClick={() => handleStartInterview(type.id)}
                      className="bg-black hover:bg-gray-800 text-lime-300"
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold">How It Works</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                <span className="font-bold text-black">1</span>
              </div>
              <h4 className="font-medium mb-2">Choose Interview Type</h4>
              <p className="text-sm text-gray-500">Select the type of interview you want to practice</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                <span className="font-bold text-black">2</span>
              </div>
              <h4 className="font-medium mb-2">Answer Questions</h4>
              <p className="text-sm text-gray-500">Respond to AI-generated interview questions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center mb-3">
                <span className="font-bold text-black">3</span>
              </div>
              <h4 className="font-medium mb-2">Get Feedback</h4>
              <p className="text-sm text-gray-500">Receive detailed feedback and improvement suggestions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
} 