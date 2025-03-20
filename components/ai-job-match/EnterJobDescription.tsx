"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Plus, 
  X, 
  ArrowRight,
  Info,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type JobFunction = {
  id: string;
  name: string;
};

export function EnterJobDescription() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobType: "full-time",
    location: "",
    isRemote: false,
  });

  const [selectedFunctions, setSelectedFunctions] = useState<JobFunction[]>([]);
  const [availableFunctions, setAvailableFunctions] = useState<JobFunction[]>([
    { id: "1", name: "Backend Engineer" },
    { id: "2", name: "Frontend Engineer" },
    { id: "3", name: "Full Stack Engineer" },
    { id: "4", name: "Data Scientist" },
    { id: "5", name: "DevOps Engineer" },
    { id: "6", name: "C++ Engineer" },
    { id: "7", name: "Product Manager" },
    { id: "8", name: "UI/UX Designer" },
    { id: "9", name: "Mobile Developer" },
  ]);

  const jobTypes = [
    { id: "full-time", label: "Full-time" },
    { id: "contract", label: "Contract" },
    { id: "part-time", label: "Part-time" },
    { id: "internship", label: "Internship" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleJobType = (typeId: string) => {
    setFormData((prev) => ({ ...prev, jobType: typeId }));
  };

  const toggleRemote = () => {
    setFormData((prev) => ({ ...prev, isRemote: !prev.isRemote }));
  };

  const addJobFunction = (jobFunction: JobFunction) => {
    setSelectedFunctions((prev) => [...prev, jobFunction]);
    setAvailableFunctions((prev) => 
      prev.filter((f) => f.id !== jobFunction.id)
    );
  };

  const removeJobFunction = (jobFunction: JobFunction) => {
    setSelectedFunctions((prev) => 
      prev.filter((f) => f.id !== jobFunction.id)
    );
    setAvailableFunctions((prev) => [...prev, jobFunction]);
  };

  const handleNext = () => {
    // Store form data in localStorage or context if needed
    router.push("/job-match/upload-cv");
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

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
      >
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-black">Find your perfect job match</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Tell us what you're looking for and we'll find the best matches for your skills and preferences</p>
        </motion.div>
        
        <motion.div variants={containerVariants} className="space-y-8">
          {/* Job Title */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
              <span className="text-red-500">*</span> Job Title
            </label>
            <Input 
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Enter your expected job title"
              className="border-gray-200 focus-visible:ring-lime-300 h-12 transition-all shadow-sm"
            />
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-black hover:bg-gray-100 transition-all">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </motion.div>
          
          {/* Job Function */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
              <span className="text-red-500">*</span> Job Function (select from options below for best results)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedFunctions.map((func) => (
                <motion.div
                  key={func.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge 
                    className="bg-lime-100 text-black border-lime-200 flex items-center gap-1 px-3 py-1.5 h-8"
                  >
                    {func.name}
                    <button 
                      onClick={() => removeJobFunction(func)} 
                      className="ml-1 text-gray-600 hover:text-black"
                      aria-label={`Remove ${func.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
            {selectedFunctions.length === 0 && (
              <p className="text-xs text-gray-500 italic">Please select your desired job function</p>
            )}
            <div className="flex flex-wrap gap-2">
              {availableFunctions.map((func) => (
                <Button 
                  key={func.id} 
                  variant="outline" 
                  className="h-10 border-gray-200 hover:border-lime-300 hover:bg-lime-50 transition-all shadow-sm"
                  onClick={() => addJobFunction(func)}
                >
                  {func.name}
                </Button>
              ))}
            </div>
          </motion.div>
          
          {/* Job Type */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1 text-gray-700">
              <span className="text-red-500">*</span> Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <Button 
                  key={type.id} 
                  variant={formData.jobType === type.id ? "default" : "outline"}
                  className={
                    formData.jobType === type.id 
                      ? "bg-lime-300 text-black hover:bg-lime-400 hover:text-black border-lime-300 transition-all shadow-sm" 
                      : "border-gray-200 text-gray-700 hover:border-lime-300 hover:bg-lime-50 transition-all shadow-sm"
                  }
                  onClick={() => toggleJobType(type.id)}
                >
                  {formData.jobType === type.id && <Check className="h-3 w-3 mr-1.5" />}
                  {type.label}
                </Button>
              ))}
            </div>
          </motion.div>
          
          {/* Location */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <Input 
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State or Region"
              className="border-gray-200 focus-visible:ring-lime-300 h-12 transition-all shadow-sm"
            />
            <div className="flex items-center gap-2 mt-2">
              <Checkbox 
                id="isRemote" 
                checked={formData.isRemote}
                onCheckedChange={toggleRemote}
                className="data-[state=checked]:bg-lime-500 data-[state=checked]:border-lime-500 transition-all"
              />
              <label 
                htmlFor="isRemote" 
                className="text-sm text-gray-700 cursor-pointer flex items-center"
              >
                Open to Remote
                <div className="relative group">
                  <span className="inline-flex items-center justify-center w-4 h-4 ml-1 bg-gray-200 rounded-full text-xs text-gray-700 cursor-help">?</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 w-48 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Indicate if you're open to remote work opportunities
                  </div>
                </div>
              </label>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-between mt-12 gap-4"
        >
          <Button 
            variant="outline" 
            className="bg-lime-100 border-lime-300 text-black hover:bg-lime-200 transition-all shadow-sm"
          >
            Use Existing Data
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-black hover:bg-gray-800 text-lime-300 transition-all shadow-md"
          >
            Continue to CV Upload <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-6 pt-4 text-center">
          <p className="flex items-center justify-center text-xs text-gray-500">
            <Info className="h-3 w-3 mr-1" />
            <span>Adding your CV in the next step will improve match accuracy</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 