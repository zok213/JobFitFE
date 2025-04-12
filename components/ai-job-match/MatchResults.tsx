"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Download, 
  ChevronDown, 
  Calendar, 
  Clock, 
  MapPin, 
  Building, 
  DollarSign,
  Share2,
  Linkedin,
  Mail,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ExternalLink,
  Star,
  Filter,
  SearchIcon,
  AlertCircle,
  BriefcaseIcon,
  CheckCircle2,
  ThumbsUp,
  Heart,
  FileCheck,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { LinkButton } from "@/components/LinkButton";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobMatchStore, JobMatchStep } from "../../store/jobMatchStore";

export function MatchResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // Use Zustand store
  const { 
    jobDetails, 
    matchResult, 
    uploadedCVs, 
    selectedCVId,
    currentStep,
    setCurrentStep
  } = useJobMatchStore();

  // Scroll details into view on mobile
  useEffect(() => {
    if (window.innerWidth < 768 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Redirect if match result is null
  useEffect(() => {
    if (!matchResult) {
      setCurrentStep(JobMatchStep.CV_UPLOAD);
      router.push("/job-match/upload-cv");
    }
  }, [matchResult, router, setCurrentStep]);

  const handleGoBack = () => {
    router.push("/job-match/details");
  };

  // Get match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "from-green-500 to-lime-500";
    if (percentage >= 80) return "from-lime-500 to-lime-400";
    if (percentage >= 70) return "from-yellow-500 to-lime-500";
    return "from-orange-500 to-yellow-500";
  };

  // Get stop colors for the gradient
  const getStopColors = (percentage: number) => {
    if (percentage >= 90) return { start: "#22c55e", end: "#84cc16" }; // green to lime
    if (percentage >= 80) return { start: "#84cc16", end: "#a3e635" }; // lime to light lime
    if (percentage >= 70) return { start: "#eab308", end: "#84cc16" }; // yellow to lime
    return { start: "#f97316", end: "#eab308" }; // orange to yellow
  };

  // Get match emoji based on percentage
  const getMatchEmoji = (percentage: number) => {
    if (percentage >= 90) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (percentage >= 80) return <ThumbsUp className="h-5 w-5 text-lime-500" />;
    if (percentage >= 70) return <ThumbsUp className="h-5 w-5 text-yellow-500" />;
    return <ThumbsUp className="h-5 w-5 text-orange-500" />;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Display loading skeleton state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh]"
        >
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-lime-500 animate-spin"></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <BriefcaseIcon className="w-8 h-8 text-lime-500" />
            </div>
          </div>
          <h3 className="mt-8 text-lg font-semibold text-gray-900">Finding your best job matches...</h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm">We're analyzing your profile and preferences to find the perfect opportunities</p>
        </motion.div>
      </div>
    );
  }

  // Display error if no match result
  if (!matchResult) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Match Results Available</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              It looks like you haven't completed the job matching process.
              Please upload your CV and provide job details to see your match results.
            </p>
            <Button
              onClick={() => router.push("/job-match/upload-cv")}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Start Job Matching
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const selectedCV = uploadedCVs.find(cv => cv.id === selectedCVId || cv.isDefault);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-6"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
            <FileCheck className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Match Results</h2>
            <p className="text-gray-600 text-sm mt-1">
              See how well your CV matches this job opportunity
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{jobDetails.title}</h3>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Building className="h-4 w-4" />
                  {jobDetails.company}
                  {jobDetails.location && (
                    <>
                      <span className="mx-1">•</span>
                      <MapPin className="h-4 w-4" />
                      {jobDetails.location}
                    </>
                  )}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500 mr-1" />
                    Using CV:
                  </div>
                  <Badge variant="outline" className="bg-lime-50 text-lime-800 border-lime-200">
                    {selectedCV?.name}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Match Score Circle */}
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="8" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke={`url(#gradient-${matchResult.matchPercentage})`} 
                        strokeWidth="8" 
                        strokeDasharray={`${2 * Math.PI * 45 * (matchResult.matchPercentage / 100)} ${2 * Math.PI * 45 * (1 - matchResult.matchPercentage / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id={`gradient-${matchResult.matchPercentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={getStopColors(matchResult.matchPercentage).start} />
                          <stop offset="100%" stopColor={getStopColors(matchResult.matchPercentage).end} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{matchResult.matchPercentage}%</span>
                      <span className="text-xs text-gray-500">Match</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {getMatchEmoji(matchResult.matchPercentage)}
                    <span className="text-sm font-medium">
                      {matchResult.matchPercentage >= 90 ? 'Excellent Match' :
                       matchResult.matchPercentage >= 80 ? 'Great Match' :
                       matchResult.matchPercentage >= 70 ? 'Good Match' :
                       'Fair Match'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  {/* Strengths Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4 text-lime-600" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {matchResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-lime-600 mt-0.5" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {matchResult.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span className="text-sm text-gray-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Analysis</h4>
              <p className="text-sm text-gray-700">
                {matchResult.analysis}
              </p>
            </div>

            {/* Recommendations */}
            <div className="mt-6 bg-lime-50 border border-lime-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-1.5">
                <Star className="h-4 w-4 text-lime-600" />
                Recommendations to Improve Your Match
              </h4>
              <ul className="space-y-2">
                {matchResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="bg-lime-200 text-lime-700 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-6 pt-6 border-t border-gray-200 flex justify-between"
        >
          <Button 
            variant="outline"
            onClick={handleGoBack}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Button>
          
          <div className="flex gap-3">
            <Button 
              className="bg-lime-600 hover:bg-lime-700 text-white shadow-sm"
              onClick={() => {}}
            >
              Apply to Job
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 