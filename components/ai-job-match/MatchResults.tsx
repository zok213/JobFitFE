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
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { LinkButton } from "@/components/LinkButton";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MatchResult = {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  matchPercentage: number;
  salary: string;
  postedDate: string;
  applicationDeadline: string;
  employmentType: string;
  skills: string[];
  description: string;
  status: "applied" | "saved" | "none";
};

export function MatchResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const detailsRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
      setResults([
        {
          id: "1",
          jobTitle: "Frontend Developer",
          company: "TechCorp Inc.",
          location: "London, UK (Remote)",
          matchPercentage: 92,
          salary: "£60,000 - £80,000",
          postedDate: "2 days ago",
          applicationDeadline: "30 June 2023",
          employmentType: "Full-time",
          skills: ["React", "TypeScript", "NextJS", "Tailwind CSS", "RESTful APIs"],
          description: "We're looking for an experienced Frontend Developer to join our product team. You'll be responsible for building user interfaces using React and TypeScript, working closely with designers and backend engineers to deliver exceptional user experiences.",
          status: "none"
        },
        {
          id: "2",
          jobTitle: "Full Stack JavaScript Developer",
          company: "Innovative Solutions Ltd",
          location: "Manchester, UK",
          matchPercentage: 87,
          salary: "£55,000 - £70,000",
          postedDate: "1 week ago",
          applicationDeadline: "15 July 2023",
          employmentType: "Full-time",
          skills: ["JavaScript", "Node.js", "React", "MongoDB", "Express"],
          description: "Join our growing team as a Full Stack JavaScript Developer. You'll be working on a variety of projects, from e-commerce platforms to enterprise applications, using the latest JavaScript technologies.",
          status: "none"
        },
        {
          id: "3",
          jobTitle: "UI/UX Designer with Frontend Skills",
          company: "Creative Digital Agency",
          location: "Birmingham, UK (Hybrid)",
          matchPercentage: 81,
          salary: "£45,000 - £60,000",
          postedDate: "3 days ago",
          applicationDeadline: "20 July 2023",
          employmentType: "Full-time",
          skills: ["UI Design", "UX Research", "HTML/CSS", "Figma", "React"],
          description: "We're seeking a talented UI/UX Designer with frontend development skills to help create beautiful, intuitive interfaces for our clients. You'll be working closely with our design and development teams to bring concepts to life.",
          status: "none"
        }
      ]);
      setSelectedJobId("1");
      setLoading(false);
      } catch (err) {
        setError("Failed to load job matches. Please try again later.");
        setLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll details into view on mobile
  useEffect(() => {
    if (selectedJobId && window.innerWidth < 768 && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedJobId]);

  // Filter results based on search query and active filter
  useEffect(() => {
    if (results.length > 0) {
      let filtered = results;
      
      // Apply text search filter
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter(job => 
          job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Apply status filter
      if (activeFilter !== "all") {
        filtered = filtered.filter(job => 
          activeFilter === "applied" ? job.status === "applied" :
          activeFilter === "saved" ? job.status === "saved" :
          job.status === "none"
        );
      }
      
      setFilteredResults(filtered);
    }
  }, [results, searchQuery, activeFilter]);

  const handleStatusChange = (jobId: string, newStatus: MatchResult['status']) => {
    setResults(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
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

  const selectedJob = results.find(job => job.id === selectedJobId);

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

  const slideInVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: { 
      x: 0, 
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
          
          <div className="mt-10 w-full max-w-md">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg bg-gray-100 p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex space-x-2 mb-3">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh]"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
          <h3 className="text-xl font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-gray-500 mt-2 text-center max-w-sm mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-black hover:bg-gray-800 text-lime-300"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">Your Job Matches</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          We've found {results.length} jobs matching your skills and preferences. Explore your opportunities below.
        </p>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Left column - Job list */}
        <motion.div 
          variants={itemVariants}
          className="w-full md:w-1/3 flex flex-col"
        >
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Available Positions</h2>
            <Badge className="bg-black text-lime-300">{filteredResults.length}</Badge>
          </div>
          
          <div className="mb-4 flex space-x-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or skills..."
                className="pl-9 border-gray-200 bg-white focus-visible:ring-lime-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search jobs by title, company or skills"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label="Filter jobs"
              title="Filter jobs"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tabs for filtering */}
          <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveFilter}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4 flex-grow overflow-auto max-h-[calc(100vh-380px)] pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <AnimatePresence>
              {filteredResults.map((job, index) => (
                <motion.div
                key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  className="transition-all duration-200"
                >
                  <Card 
                    className={`border hover:shadow-md transition-all duration-300 ${
                  selectedJobId === job.id 
                        ? "border-lime-300 bg-lime-50/30 shadow-sm" 
                        : "bg-white border-gray-200"
                }`}
                onClick={() => setSelectedJobId(job.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedJobId(job.id);
                      }
                    }}
                    aria-label={`View details for ${job.jobTitle} at ${job.company}, ${job.matchPercentage}% match`}
                    aria-pressed={selectedJobId === job.id}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow pr-2">
                          <CardTitle className="text-lg font-bold text-gray-900 mb-1">{job.jobTitle}</CardTitle>
                          <div className="text-gray-600 text-sm mb-2 flex items-center">
                            <Building className="h-3 w-3 mr-1.5 inline flex-shrink-0" />
                            {job.company}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
                              <MapPin className="h-3 w-3 mr-1" />
                              {job.location}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-normal text-gray-600 bg-gray-50">
                              <Clock className="h-3 w-3 mr-1" />
                              {job.employmentType}
                  </Badge>
                </div>
                          
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {job.skills.slice(0, 3).map((skill) => (
                              <Badge 
                                key={skill} 
                                className="bg-lime-50 text-lime-800 border-lime-100 px-1.5 py-0.5 text-[10px]"
                              >
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && (
                              <Badge
                                className="bg-gray-50 text-gray-600 border-gray-100 px-1.5 py-0.5 text-[10px]"
                              >
                                +{job.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            Posted {job.postedDate}
                          </div>
                        </div>
                        
                        <div className="ml-2 flex flex-col items-center">
                          <div 
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm relative bg-gradient-to-br ${getMatchColor(job.matchPercentage)} shadow-lg`}
                          >
                            <div className="absolute inset-0.5 bg-white rounded-full shadow-inner"></div>
                            <div className={`absolute inset-1 rounded-full bg-gradient-to-br ${getMatchColor(job.matchPercentage)} flex items-center justify-center`}>
                              {job.matchPercentage}%
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 font-medium">Match</div>
                        </div>
                </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        {job.status !== "none" ? (
                          <Badge 
                            className={
                              job.status === "applied" 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {job.status === "applied" ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Applied
                              </>
                            ) : (
                              <>
                                <Heart className="h-3 w-3 mr-1" />
                                Saved
                              </>
                            )}
                          </Badge>
                        ) : (
                          <div className="text-xs text-gray-500">
                            {job.salary}
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-gray-500 hover:text-lime-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(job.id, job.status === "saved" ? "none" : "saved");
                            }}
                            title={job.status === "saved" ? "Remove from saved" : "Save job"}
                          >
                            <Heart className={`h-4 w-4 ${job.status === "saved" ? "fill-lime-500 text-lime-500" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredResults.length === 0 && (
              <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-4 text-gray-400">
                  <SearchIcon className="h-8 w-8 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No matching jobs found</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto mt-1">
                  Try adjusting your search or filters to find more opportunities
                </p>
              </div>
            )}
          </div>
          
          <motion.div variants={itemVariants}>
          <Button 
            variant="outline" 
            className="mt-6 border-gray-300 text-gray-600 flex items-center gap-2 w-full"
            onClick={() => router.push("/job-match")}
              aria-label="Go back to job search page"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Search
          </Button>
          </motion.div>
        </motion.div>
        
        {/* Right column - Job details */}
        {selectedJob && (
          <motion.div 
            variants={slideInVariants}
            className="w-full md:w-2/3"
            ref={detailsRef}
          >
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-lime-300 to-lime-500"></div>
              <CardContent className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  key={selectedJob.id}
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 mb-6">
              <div>
                      <h2 className="text-2xl font-bold text-gray-900 break-words">{selectedJob.jobTitle}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-gray-700 font-medium flex items-center">
                          <Building className="h-4 w-4 mr-1.5 text-gray-500" />
                          {selectedJob.company}
                        </span>
                        <span className="text-gray-400 hidden md:inline">•</span>
                  <span className="text-gray-600 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" /> 
                          {selectedJob.location}
                  </span>
                </div>
              </div>
                    
                    <div className="min-w-28 h-28 relative mx-auto md:mx-0">
                      <div className="absolute inset-0 rounded-full bg-gray-100 shadow-inner"></div>
                      <svg className="absolute inset-0" width="112" height="112" viewBox="0 0 112 112">
                        <defs>
                          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="48" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="8"
                        />
                        <circle 
                          cx="56" 
                          cy="56" 
                          r="48" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={2 * Math.PI * 48 * (1 - selectedJob.matchPercentage / 100)}
                          transform="rotate(-90 56 56)"
                          filter="url(#glow)"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={getStopColors(selectedJob.matchPercentage).start} />
                            <stop offset="100%" stopColor={getStopColors(selectedJob.matchPercentage).end} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-center">
                          {getMatchEmoji(selectedJob.matchPercentage)}
                          <span className="text-3xl font-bold text-gray-900 ml-1">{selectedJob.matchPercentage}%</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Match Score</span>
                      </div>
                    </div>
            </div>
            
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors hover:bg-gray-50/80">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Building className="h-3 w-3" /> Company
                </div>
                      <div className="font-medium text-gray-900">{selectedJob.company}</div>
              </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors hover:bg-gray-50/80">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Salary
                </div>
                      <div className="font-medium text-gray-900">{selectedJob.salary}</div>
              </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors hover:bg-gray-50/80">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Job Type
                </div>
                      <div className="font-medium text-gray-900">{selectedJob.employmentType}</div>
              </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors hover:bg-gray-50/80">
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Deadline
                </div>
                      <div className="font-medium text-gray-900">{selectedJob.applicationDeadline}</div>
              </div>
            </div>
            
            <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-lime-500" />
                      Skills Match
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                {selectedJob.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                          className="bg-lime-50 hover:bg-lime-100 border border-lime-200 text-gray-800 transition-colors px-3 py-1 text-xs flex items-center"
                  >
                          <div className="w-2 h-2 bg-lime-500 rounded-full mr-1.5"></div>
                          {skill}
                  </Badge>
                ))}
              </div>
                    <div className="mt-4 bg-lime-50/70 rounded-lg p-4 border border-lime-200">
                      <div className="text-sm text-gray-800">
                        <div className="flex items-center gap-2 font-medium mb-2 text-lime-800">
                          <Check className="h-5 w-5 text-lime-600" />
                          Your profile matches {selectedJob.matchPercentage}% of required skills
                        </div>
                        <div className="text-sm text-gray-600">
                          Based on your CV and job preferences, you're an excellent match for this position. This job aligns well with your experience and career goals.
                        </div>
                      </div>
              </div>
            </div>
            
            <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                    <div className="text-gray-700 rounded-lg border border-gray-100 p-5 bg-white">
                      <p className="leading-relaxed">{selectedJob.description}</p>
                    </div>
            </div>
            
            <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
              <Button 
                      className="bg-black hover:bg-gray-800 text-lime-300 font-medium min-w-[120px] flex-1 md:flex-none h-12"
                onClick={() => handleStatusChange(selectedJob.id, "applied")}
                disabled={selectedJob.status === "applied"}
                      aria-label={selectedJob.status === "applied" ? "Already applied" : "Apply for this job"}
              >
                {selectedJob.status === "applied" ? (
                  <>
                          <Check className="mr-2 h-5 w-5" />
                    Applied
                  </>
                ) : "Apply Now"}
              </Button>
              <Button 
                variant="outline" 
                      className={`border-gray-300 flex items-center gap-2 flex-1 md:flex-none h-12 ${
                  selectedJob.status === "saved" 
                    ? "bg-lime-50 border-lime-200 text-black" 
                    : "text-gray-600 hover:bg-lime-50 hover:border-lime-200 hover:text-black"
                }`}
                onClick={() => handleStatusChange(selectedJob.id, selectedJob.status === "saved" ? "none" : "saved")}
                      aria-pressed={selectedJob.status === "saved"}
                      aria-label={selectedJob.status === "saved" ? "Remove from saved jobs" : "Save this job"}
              >
                {selectedJob.status === "saved" ? (
                  <>
                          <Heart className="h-5 w-5 fill-black" />
                    Saved
                  </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5" />
                          Save Job
                        </>
                      )}
              </Button>
              <Button 
                variant="outline" 
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 flex-1 md:flex-none h-12"
                      aria-label="View original job posting"
              >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View Original
              </Button>
                    <div className="flex gap-2 ml-auto mt-4 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="icon"
                        className="border-gray-300 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 h-12 w-12"
                  aria-label="Share on LinkedIn"
                        title="Share on LinkedIn"
                >
                        <Linkedin className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 h-12 w-12"
                  aria-label="Share with others"
                        title="Share this job"
                >
                        <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 