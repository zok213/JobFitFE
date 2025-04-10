"use client";

import React, { useState, useEffect } from 'react';
import { DashboardShell } from "@/components/DashboardShell";
import { RoadmapVisualizer } from "@/components/ai-roadmap/RoadmapVisualizer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { LinkButton } from "@/components/LinkButton";

export default function RoadmapVisualizerPage() {
  const router = useRouter();
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the roadmap data from the API or local storage
    // In a real app, this would retrieve the data from the API response
    // For now, we'll simulate a loading delay and use mock data
    const fetchRoadmap = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would be:
        // const response = await fetch('/api/roadmap/get-latest');
        // const data = await response.json();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockData = {
          roadmapTitle: "Frontend Developer to Senior Engineer Career Path",
  steps: [
    {
              id: "step1",
              title: "Foundation Building",
              description: "Strengthen your core frontend development skills and build a solid foundation",
              timeframe: "0-6 months",
              estimatedDuration: "6 months",
              type: "learning",
      skills: [
                { name: "HTML5", level: 85, type: "technical" },
                { name: "CSS3", level: 80, type: "technical" },
                { name: "JavaScript", level: 75, type: "technical" },
                { name: "Responsive Design", level: 70, type: "technical" },
                { name: "Web Accessibility", level: 60, type: "technical" },
                { name: "Self-Learning", level: 85, type: "soft" },
      ],
      resources: [
                { 
                  title: "Modern JavaScript Course",
                  link: "https://example.com/js-course",
                  type: "course"
                },
                {
                  title: "Frontend Developer Handbook",
                  link: "https://example.com/fe-handbook",
                  type: "book"
                }
      ],
      milestones: [
                { title: "Build a responsive portfolio website", completed: false },
                { title: "Complete JavaScript fundamentals course", completed: false },
                { title: "Implement accessibility standards in projects", completed: false }
              ]
            },
            {
              id: "step2",
              title: "Framework Mastery",
              description: "Become proficient in a modern frontend framework to build complex applications",
              timeframe: "6-12 months",
              estimatedDuration: "6 months",
              type: "project",
      skills: [
                { name: "React.js", level: 80, type: "technical" },
                { name: "State Management", level: 75, type: "technical" },
                { name: "Component Architecture", level: 70, type: "technical" },
                { name: "Testing", level: 65, type: "technical" },
                { name: "Problem Solving", level: 80, type: "soft" },
      ],
      resources: [
                { 
                  title: "React Complete Guide",
                  link: "https://example.com/react-guide",
                  type: "course"
                },
                {
                  title: "Build a Full-Stack App",
                  link: "https://example.com/fullstack-project",
                  type: "project"
                }
      ],
      milestones: [
                { title: "Build a complex React application", completed: false },
                { title: "Implement state management with Redux", completed: false },
                { title: "Write comprehensive tests", completed: false }
              ]
            },
            {
              id: "step3",
              title: "Advanced Concepts",
              description: "Deepen your knowledge with advanced frontend concepts and optimization techniques",
              timeframe: "12-18 months",
              estimatedDuration: "6 months",
              type: "learning",
      skills: [
                { name: "Performance Optimization", level: 85, type: "technical" },
                { name: "Advanced State Management", level: 80, type: "technical" },
                { name: "Server-Side Rendering", level: 75, type: "technical" },
                { name: "Code Architecture", level: 70, type: "technical" },
                { name: "Critical Thinking", level: 85, type: "soft" },
      ],
      resources: [
                { 
                  title: "Frontend Performance Masterclass",
                  link: "https://example.com/performance",
                  type: "course"
                },
                {
                  title: "Advanced React Patterns",
                  link: "https://example.com/advanced-patterns",
                  type: "documentation"
                }
      ],
      milestones: [
                { title: "Optimize application performance", completed: false },
                { title: "Implement SSR in an existing application", completed: false },
                { title: "Refactor code using advanced patterns", completed: false }
              ]
            },
            {
              id: "step4",
              title: "Professional Experience",
              description: "Gain professional experience working on complex projects and collaborating with teams",
              timeframe: "18-30 months",
              estimatedDuration: "12 months",
              type: "experience",
      skills: [
                { name: "Team Collaboration", level: 90, type: "soft" },
                { name: "Project Management", level: 75, type: "soft" },
                { name: "Code Reviews", level: 85, type: "technical" },
                { name: "Technical Documentation", level: 80, type: "technical" },
                { name: "Client Communication", level: 75, type: "soft" },
      ],
      resources: [
                { 
                  title: "Effective Code Reviews",
                  link: "https://example.com/code-reviews",
                  type: "book"
                },
                {
                  title: "Technical Documentation Guide",
                  link: "https://example.com/documentation",
                  type: "documentation"
                }
      ],
      milestones: [
                { title: "Lead a feature development from start to finish", completed: false },
                { title: "Contribute to code reviews regularly", completed: false },
                { title: "Create comprehensive documentation", completed: false }
              ]
            },
            {
              id: "step5",
              title: "Leadership & Mentoring",
              description: "Develop leadership skills and begin mentoring junior developers",
              timeframe: "30-36 months",
              estimatedDuration: "6 months",
              type: "experience",
      skills: [
                { name: "Mentoring", level: 85, type: "soft" },
                { name: "Technical Leadership", level: 80, type: "soft" },
                { name: "Architectural Decision Making", level: 75, type: "technical" },
                { name: "Team Management", level: 70, type: "soft" },
                { name: "Strategic Planning", level: 75, type: "soft" },
      ],
      resources: [
                { 
                  title: "Technical Leadership Course",
                  link: "https://example.com/tech-leadership",
                  type: "course"
                },
                {
                  title: "Mentoring for Software Engineers",
                  link: "https://example.com/mentoring",
                  type: "book"
                }
      ],
      milestones: [
                { title: "Mentor junior developers", completed: false },
                { title: "Lead architectural decisions", completed: false },
                { title: "Develop team growth plans", completed: false }
              ]
            }
          ],
          currentProgress: 35
        };
        
        setRoadmapData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load roadmap data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <DashboardShell activeNavItem="roadmap" userRole="employee">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8">
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
            aria-label="Return to roadmap generator"
          >
            Back to Generator
          </LinkButton>
        </div>
        
        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-lime-300 animate-spin mb-4" />
            <p className="text-gray-600">Loading your personalized roadmap...</p>
          </div>
        ) : error ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => router.push("/roadmap")}
                className="bg-black hover:bg-gray-800 text-lime-300"
              >
                Go Back and Try Again
              </Button>
            </div>
          </div>
        ) : roadmapData ? (
        <RoadmapVisualizer 
            roadmapTitle={roadmapData.roadmapTitle}
            steps={roadmapData.steps}
            currentProgress={roadmapData.currentProgress}
          />
        ) : null}
      </div>
    </DashboardShell>
  );
} 