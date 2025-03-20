"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { 
  ChevronRight, 
  Upload, 
  File, 
  ArrowLeft, 
  Loader2, 
  Check, 
  FileText,
  X,
  Info,
  FileUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export function UploadCV() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [useExistingCV, setUseExistingCV] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
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

  // Simulate progress during upload
  useEffect(() => {
    if (uploadStatus === "uploading") {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadStatus("success");
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [uploadStatus]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith('.docx') || file.name.endsWith('.doc'))) {
      handleFile(file);
    } else {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 3000);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setUploadStatus("uploading");
    setUploadProgress(0);
    setUseExistingCV(false);
  };

  const handleExistingCV = () => {
    setUseExistingCV(true);
    setFileName("your_resume.pdf");
    setFileSize(258000);
    setUploadStatus("success");
    setUploadProgress(100);
  };

  const handleContinue = () => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      router.push("/job-match/results");
    }, 1000);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFileSize(null);
    setUploadStatus("idle");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-lime-300 flex items-center justify-center">
            <FileUp className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Upload your CV</h2>
            <p className="text-gray-600 text-sm mt-1">
              Upload your CV to improve the accuracy of your job matches
            </p>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} className="space-y-8">
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {!fileName ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border-2 border-dashed rounded-lg p-12 text-center ${
                    dragActive ? "border-lime-300 bg-lime-50" : "border-gray-300 hover:border-lime-300 hover:bg-lime-50"
                  } transition-colors duration-200 ease-in-out`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <motion.div 
                      className="w-20 h-20 rounded-full bg-lime-100 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Upload className="h-8 w-8 text-black" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-medium text-black">Drag and drop your CV here</h3>
                      <p className="text-gray-600 text-sm mt-2 mb-4">
                        Supported formats: PDF, DOCX, DOC (Max 5MB)
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-400">or</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gray-300 hover:border-lime-300 hover:bg-lime-50 px-5 py-6 h-auto text-base"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                      aria-label="Upload CV file"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                        <File className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="font-medium text-black">{fileName}</p>
                        <p className="text-xs text-gray-500">{fileSize ? `${(fileSize / 1024).toFixed(0)} KB` : ''}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {uploadStatus === "uploading" && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Uploading...</span>
                        <span className="text-sm font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" indicatorClassName="bg-lime-300" />
                    </div>
                  )}
                  
                  {uploadStatus === "success" && (
                    <div className="bg-lime-50 border border-lime-200 rounded-md p-3 flex items-center mb-4">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-sm text-gray-800">Your CV has been uploaded successfully.</p>
                    </div>
                  )}
                  
                  {uploadStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center mb-4">
                      <X className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-sm text-gray-800">There was an error uploading your file. Please try again.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-gray-200 shadow-sm bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">Use existing CV</h3>
                    <p className="text-sm text-gray-600">We found a CV on your profile</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className={`w-full justify-center ${
                    useExistingCV ? 'border-lime-300 bg-lime-50 text-black' : 'border-gray-300 hover:border-lime-300 hover:bg-lime-50'
                  }`}
                  onClick={handleExistingCV}
                >
                  {useExistingCV ? (
                    <>
                      <Check className="h-4 w-4 mr-2" /> Using Existing CV
                    </>
                  ) : (
                    'Use Existing CV'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="flex flex-col sm:flex-row justify-between mt-8 gap-4"
        >
          <motion.div variants={itemVariants}>
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50"
              onClick={() => router.push("/job-match")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              className="bg-black hover:bg-gray-800 text-lime-300 font-medium px-5"
              onClick={handleContinue}
              disabled={isLoading || uploadStatus !== "success"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Continue to Results
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-6 pt-2 text-center">
          <p className="flex items-center justify-center text-xs text-gray-500">
            <Info className="h-3 w-3 mr-1" />
            <span>You can also continue without uploading a CV, but matching accuracy may be reduced</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 