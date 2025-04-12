"use client";

import React, { useState, useEffect } from 'react';
import { DashboardShell } from "@/components/DashboardShell";
import { RoadmapVisualizer } from "@/components/ai-roadmap/RoadmapVisualizer";
import { RoadmapLayout } from "@/components/ai-roadmap/RoadmapLayout";
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
            // Additional steps excluded for brevity but would be included in the actual data
          ],
          currentProgress: 35
        };
        
        setRoadmapData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching roadmap data:', error);
        setError('Failed to load your career roadmap. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchRoadmap();
  }, []);

  return (
    <DashboardShell activeNavItem="roadmap" userRole="employee">
      <RoadmapLayout activeStep="visualizer">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex items-center justify-center bg-lime-100 rounded-full w-16 h-16 mb-4">
              <Loader2 className="h-8 w-8 text-lime-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Generating Your Career Roadmap</h3>
            <p className="text-gray-500 text-center max-w-md">
              We're analyzing your goals and creating a personalized development path with milestones and resources.
            </p>
          </div>
        ) : error ? (
          // Error state
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md mb-6">
              <p>{error}</p>
            </div>
            <Button onClick={() => router.push('/roadmap')}>
              Go Back & Try Again
            </Button>
          </div>
        ) : (
          // Success state - render the roadmap
          <RoadmapVisualizer 
            roadmapTitle={roadmapData.roadmapTitle} 
            steps={roadmapData.steps}
            currentProgress={roadmapData.currentProgress}
          />
        )}
      </RoadmapLayout>
    </DashboardShell>
  );
} 