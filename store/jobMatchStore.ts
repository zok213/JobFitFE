import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enum for Job Match Steps
export enum JobMatchStep {
  CV_UPLOAD = 'cv-upload',
  JOB_DETAILS = 'job-details',
  JOB_MATCH = 'job-match',
  ENHANCEMENT = 'enhancement',
  APPLICATION = 'application'
}

interface CV {
  id: string;
  name: string;
  url: string;
  size: number;
  isDefault?: boolean;
  createdAt: string;
}

interface JobDetails {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  jobUrl?: string;
  location?: string;
  mode?: string; // remote, hybrid, on-site
  salaryRange?: string;
  industry?: string;
}

interface MatchResult {
  score: number;
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  analysis: string;
}

interface Enhancement {
  id: string;
  type: 'cv' | 'coverLetter';
  content: string;
  createdAt: string;
  isApplied: boolean;
}

interface JobMatchState {
  currentStep: JobMatchStep;
  uploadedCVs: CV[];
  selectedCVId: string | null;
  jobDetails: JobDetails;
  matchResult: MatchResult | null;
  enhancements: Enhancement[];
  applicationStatus: 'not-started' | 'in-progress' | 'submitted';
  
  // Actions
  setCurrentStep: (step: JobMatchStep) => void;
  addCV: (cv: CV) => void;
  updateCV: (id: string, cv: Partial<CV>) => void;
  removeCV: (id: string) => void;
  setDefaultCV: (id: string) => void;
  setSelectedCV: (id: string) => void;
  updateJobDetails: (details: Partial<JobDetails>) => void;
  setMatchResult: (result: MatchResult) => void;
  addEnhancement: (enhancement: Enhancement) => void;
  updateEnhancement: (id: string, enhancement: Partial<Enhancement>) => void;
  removeEnhancement: (id: string) => void;
  setApplicationStatus: (status: 'not-started' | 'in-progress' | 'submitted') => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  currentStep: JobMatchStep.CV_UPLOAD,
  uploadedCVs: [],
  selectedCVId: null,
  jobDetails: {
    title: '',
    company: '',
    description: '',
    requirements: []
  },
  matchResult: null,
  enhancements: [],
  applicationStatus: 'not-started' as const
};

export const useJobMatchStore = create<JobMatchState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentStep: (step: JobMatchStep) => 
        set({ currentStep: step }),
      
      addCV: (cv: CV) =>
        set((state) => ({
          uploadedCVs: [...state.uploadedCVs, cv]
        })),
      
      updateCV: (id, cv) =>
        set((state) => ({
          uploadedCVs: state.uploadedCVs.map(item =>
            item.id === id ? { ...item, ...cv } : item
          )
        })),
      
      removeCV: (id) =>
        set((state) => ({
          uploadedCVs: state.uploadedCVs.filter(item => item.id !== id),
          selectedCVId: state.selectedCVId === id ? null : state.selectedCVId
        })),
      
      setDefaultCV: (id) =>
        set((state) => ({
          uploadedCVs: state.uploadedCVs.map(item => ({
            ...item,
            isDefault: item.id === id
          }))
        })),
      
      setSelectedCV: (id) =>
        set({ selectedCVId: id }),
      
      updateJobDetails: (details) =>
        set((state) => ({
          jobDetails: { ...state.jobDetails, ...details }
        })),
      
      setMatchResult: (result) =>
        set({ matchResult: result }),
      
      addEnhancement: (enhancement) =>
        set((state) => ({
          enhancements: [...state.enhancements, enhancement]
        })),
      
      updateEnhancement: (id, enhancement) =>
        set((state) => ({
          enhancements: state.enhancements.map(item =>
            item.id === id ? { ...item, ...enhancement } : item
          )
        })),
      
      removeEnhancement: (id) =>
        set((state) => ({
          enhancements: state.enhancements.filter(item => item.id !== id)
        })),
      
      setApplicationStatus: (status) =>
        set({ applicationStatus: status }),
      
      resetState: () => set(initialState)
    }),
    {
      name: 'job-match-storage', // unique name for localStorage
    }
  )
); 