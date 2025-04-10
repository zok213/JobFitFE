"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoadmapForm } from "./RoadmapForm";
import { Target, GraduationCap, Award, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoadmapPage() {
  const router = useRouter();

  return (
    <DashboardShell activeNavItem="roadmap" userRole="employee">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Career Roadmap</h1>
          <p className="text-gray-500 mt-1">
            Plan your career development with our AI-powered roadmap generator
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RoadmapForm />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">How It Works</h2>
                  <p className="text-gray-500">Our AI helps you map and track your career development</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mt-1">
                    <Target className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Define Your Goals</h3>
                    <p className="text-sm text-gray-600">Tell us about your current position, skills, and where you want to be in your career</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mt-1">
                    <GraduationCap className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Your Roadmap</h3>
                    <p className="text-sm text-gray-600">Our AI generates a personalized career roadmap with milestones and skill requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center mt-1">
                    <Award className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Track Your Progress</h3>
                    <p className="text-sm text-gray-600">Follow your roadmap, update your skills, and adjust your path as you grow</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Why Use Career Roadmaps?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Visualize your career journey</li>
                  <li>• Identify skill gaps and learning opportunities</li>
                  <li>• Set realistic timeframes for career growth</li>
                  <li>• Track your progress towards your goals</li>
                </ul>
              </div>
            </div>
            
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Already have a CV?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your CV to get a more personalized roadmap based on your experience
                </p>
                <Button 
                  className="w-full bg-lime-300 text-black hover:bg-lime-200 transition-colors font-medium"
                  onClick={() => router.push("/cv-assistant")}
                >
                  Analyze Your CV First
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
} 