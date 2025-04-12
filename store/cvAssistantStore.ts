import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Enum for CV Assistant Steps
export enum CVAssistantStep {
  UPLOAD = 'upload',
  ANALYZE = 'analyze',
  ENHANCE = 'enhance',
  DOWNLOAD = 'download'
}

interface CVFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

interface CVAnalysis {
  score: number;
  strengthAreas: string[];
  weakAreas: string[];
  recommendations: string[];
  keywordMatch: {
    matched: string[];
    missing: string[];
  };
  formattingIssues: string[];
  detailedFeedback: {
    section: string;
    feedback: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface Enhancement {
  id: string;
  type: 'content' | 'formatting' | 'keywords';
  beforeContent: string;
  afterContent: string;
  section: string;
  isApplied: boolean;
}

interface CVAssistantState {
  currentStep: CVAssistantStep;
  uploadedCV: CVFile | null;
  targetJobTitle: string;
  targetJobDescription: string;
  analysis: CVAnalysis | null;
  enhancements: Enhancement[];
  enhancedCVUrl: string | null;
  
  // Actions
  setCurrentStep: (step: CVAssistantStep) => void;
  setUploadedCV: (cv: CVFile | null) => void;
  setTargetJobTitle: (title: string) => void;
  setTargetJobDescription: (description: string) => void;
  setAnalysis: (analysis: CVAnalysis | null) => void;
  addEnhancement: (enhancement: Enhancement) => void;
  updateEnhancement: (id: string, changes: Partial<Enhancement>) => void;
  removeEnhancement: (id: string) => void;
  applyEnhancement: (id: string, isApplied: boolean) => void;
  setEnhancedCVUrl: (url: string | null) => void;
  resetState: () => void;
}

// Initial state
const initialState = {
  currentStep: CVAssistantStep.UPLOAD,
  uploadedCV: null,
  targetJobTitle: '',
  targetJobDescription: '',
  analysis: null,
  enhancements: [],
  enhancedCVUrl: null
};

export const useCVAssistantStore = create<CVAssistantState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setCurrentStep: (step: CVAssistantStep) => 
        set({ currentStep: step }),
        
      setUploadedCV: (cv: CVFile | null) =>
        set({ uploadedCV: cv }),
        
      setTargetJobTitle: (title: string) =>
        set({ targetJobTitle: title }),
        
      setTargetJobDescription: (description: string) =>
        set({ targetJobDescription: description }),
        
      setAnalysis: (analysis: CVAnalysis | null) =>
        set({ analysis }),
        
      addEnhancement: (enhancement: Enhancement) =>
        set((state) => ({
          enhancements: [...state.enhancements, enhancement]
        })),
        
      updateEnhancement: (id: string, changes: Partial<Enhancement>) =>
        set((state) => ({
          enhancements: state.enhancements.map(item => 
            item.id === id ? { ...item, ...changes } : item
          )
        })),
        
      removeEnhancement: (id: string) =>
        set((state) => ({
          enhancements: state.enhancements.filter(item => item.id !== id)
        })),
        
      applyEnhancement: (id: string, isApplied: boolean) =>
        set((state) => ({
          enhancements: state.enhancements.map(item =>
            item.id === id ? { ...item, isApplied } : item
          )
        })),
        
      setEnhancedCVUrl: (url: string | null) =>
        set({ enhancedCVUrl: url }),
        
      resetState: () => set(initialState)
    }),
    {
      name: 'cv-assistant-storage', // unique name for localStorage
    }
  )
); 