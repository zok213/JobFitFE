"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  BookOpen, 
  Briefcase, 
  Code, 
  Globe, 
  HeartHandshake, 
  Languages, 
  Medal, 
  MessageCircle, 
  Podcast, 
  PlusCircle
} from "lucide-react";

interface CustomSectionItem {
  id: string;
  type: string;
  title: string;
  content: any[];
}

interface CustomSectionsPanelProps {
  data: Record<string, CustomSectionItem>;
  updateData: (data: Record<string, CustomSectionItem>) => void;
}

export function CustomSectionsPanel({ data, updateData }: CustomSectionsPanelProps) {
  const sectionTypes = [
    { id: "courses", title: "Courses", icon: BookOpen, description: "Add relevant courses you've completed" },
    { id: "languages", title: "Languages", icon: Languages, description: "Highlight languages you speak" },
    { id: "certificates", title: "Certificates", icon: Award, description: "Show off your professional certifications" },
    { id: "projects", title: "Projects", icon: Code, description: "Highlight relevant projects you've worked on" },
    { id: "publications", title: "Publications", icon: Podcast, description: "Add any articles, papers, or books you've published" },
    { id: "references", title: "References", icon: MessageCircle, description: "List individuals who can recommend you" },
    { id: "hobbies", title: "Hobbies", icon: HeartHandshake, description: "Show your personality with activities you enjoy" },
    { id: "achievements", title: "Achievements", icon: Medal, description: "Highlight awards and notable accomplishments" },
    { id: "volunteering", title: "Volunteering", icon: Globe, description: "Show your commitment to helping others" },
    { id: "internships", title: "Internships", icon: Briefcase, description: "Include relevant internship experiences" }
  ];
  
  const addSection = (type: string, title: string) => {
    const newSection: CustomSectionItem = {
      id: `section-${Date.now()}`,
      type,
      title,
      content: []
    };
    
    updateData({
      ...data,
      [type]: newSection
    });
  };
  
  const isSectionAdded = (type: string) => {
    return Object.values(data).some(section => section.type === type);
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Add Section</CardTitle>
        <CardDescription>
          Enhance your resume with additional sections to showcase more of your qualifications
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionTypes.map((sectionType) => {
            const isAdded = isSectionAdded(sectionType.id);
            
            return (
              <Card 
                key={sectionType.id} 
                className={`border ${
                  isAdded ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } transition-colors overflow-hidden`}
              >
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-full ${
                      isAdded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <sectionType.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium">{sectionType.title}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    {sectionType.description}
                  </p>
                  
                  <Button 
                    variant={isAdded ? "outline" : "default"}
                    className={isAdded 
                      ? "w-full border-blue-300 text-blue-600 cursor-default" 
                      : "w-full bg-lime-600 hover:bg-lime-700 text-white"
                    }
                    disabled={isAdded}
                    onClick={() => addSection(sectionType.id, sectionType.title)}
                  >
                    {isAdded ? (
                      <span>Added</span>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Section
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex flex-col items-center justify-center mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h3 className="font-medium text-gray-800 mb-2">Need something more specific?</h3>
          <p className="text-sm text-gray-600 text-center mb-4">
            You can create a custom section with your own title and content
          </p>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Custom Section
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 