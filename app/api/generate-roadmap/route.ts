import { NextResponse } from 'next/server';

type SkillItem = {
  name: string;
  level: number; // 0-100
  type: 'technical' | 'soft' | 'domain';
};

type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  estimatedDuration: string;
  skills: SkillItem[];
  resources: {
    title: string;
    link: string;
    type: 'course' | 'book' | 'documentation' | 'video' | 'project';
  }[];
  milestones: {
    title: string;
    completed: boolean;
  }[];
  type: 'learning' | 'project' | 'certification' | 'experience';
};

export async function POST(req: Request) {
  try {
    const { currentRole, targetRole, yearsExperience, skills, interests } = await req.json();

    // In a real implementation, this would call an AI model or service
    // For now, we'll generate a mock roadmap based on the input

    // Generate a unique ID for each step
    const generateId = () => Math.random().toString(36).substring(2, 9);

    // Generate the roadmap steps
    const roadmapSteps: RoadmapStep[] = [
      {
        id: generateId(),
        title: "Foundation Building",
        description: `Starting from your current role as ${currentRole}, this phase focuses on strengthening your foundational skills needed for ${targetRole}`,
        timeframe: "0-3 months",
        estimatedDuration: "3 months",
        type: "learning",
        skills: [
          { name: "Core Technologies", level: 60, type: "technical" },
          { name: "Industry Knowledge", level: 75, type: "domain" },
          { name: "Self-Directed Learning", level: 80, type: "soft" },
        ],
        resources: [
          { 
            title: "Fundamentals Course",
            link: "https://example.com/course",
            type: "course"
          },
          {
            title: "Industry Best Practices",
            link: "https://example.com/book",
            type: "book"
          }
        ],
        milestones: [
          { title: "Complete foundational learning", completed: false },
          { title: "Set up development environment", completed: false }
        ]
      },
      {
        id: generateId(),
        title: "Skill Building",
        description: "Developing specific technical and soft skills required for your target role",
        timeframe: "3-6 months",
        estimatedDuration: "3 months",
        type: "project",
        skills: [
          { name: "Advanced Technologies", level: 70, type: "technical" },
          { name: "Problem Solving", level: 85, type: "soft" },
          { name: "Communication", level: 75, type: "soft" },
        ],
        resources: [
          { 
            title: "Advanced Course",
            link: "https://example.com/advanced",
            type: "course"
          },
          {
            title: "Practical Projects",
            link: "https://example.com/projects",
            type: "project"
          }
        ],
        milestones: [
          { title: "Complete 2 projects", completed: false },
          { title: "Receive peer feedback", completed: false }
        ]
      },
      {
        id: generateId(),
        title: "Professional Certification",
        description: "Obtaining relevant certifications to validate your skills and knowledge",
        timeframe: "6-9 months",
        estimatedDuration: "3 months",
        type: "certification",
        skills: [
          { name: "Specialized Knowledge", level: 85, type: "technical" },
          { name: "Test-Taking", level: 70, type: "soft" },
        ],
        resources: [
          { 
            title: "Certification Prep Course",
            link: "https://example.com/cert-prep",
            type: "course"
          },
          {
            title: "Practice Exams",
            link: "https://example.com/practice",
            type: "documentation"
          }
        ],
        milestones: [
          { title: "Complete preparation", completed: false },
          { title: "Pass certification exam", completed: false }
        ]
      },
      {
        id: generateId(),
        title: "Career Transition",
        description: `Making the move from ${currentRole} to ${targetRole} through networking and job applications`,
        timeframe: "9-12 months",
        estimatedDuration: "3 months",
        type: "experience",
        skills: [
          { name: "Networking", level: 75, type: "soft" },
          { name: "Interview Skills", level: 80, type: "soft" },
          { name: "Portfolio Development", level: 90, type: "technical" },
        ],
        resources: [
          { 
            title: "Resume and Portfolio Workshop",
            link: "https://example.com/portfolio",
            type: "video"
          },
          {
            title: "Interview Preparation",
            link: "https://example.com/interview",
            type: "course"
          }
        ],
        milestones: [
          { title: "Update resume and portfolio", completed: false },
          { title: "Apply to target positions", completed: false },
          { title: "Secure new role", completed: false }
        ]
      }
    ];

    return NextResponse.json({ 
      roadmapTitle: `${currentRole} to ${targetRole} Career Path`,
      steps: roadmapSteps,
      currentProgress: 0 
    });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
} 