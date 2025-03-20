"use client";

import React, { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { FileText, Upload, Check, AlertCircle, FileType, Loader2, ArrowRight, Edit, FilePlus, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function CVAssistantPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setUploadStatus('success');
  };

  const handleAnalyzeCV = () => {
    setIsUploading(true);
    
    // Simulate upload and processing
    setTimeout(() => {
      router.push("/cv-assistant/analysis");
    }, 2000);
  };

  return (
    <DashboardShell activeNavItem="cv-assistant">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">AI CV Assistant</h1>
          <p className="text-gray-500 mt-1">Get AI-powered suggestions to improve your CV</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-lime-300 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload Existing CV</h3>
              <p className="text-gray-500 mb-6 text-sm">Upload your CV to get AI-powered suggestions for improvement</p>
              <Button className="bg-black text-lime-300 hover:bg-gray-800">
                Upload CV
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-lime-300 rounded-full flex items-center justify-center mb-4">
                <FileEdit className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create New CV</h3>
              <p className="text-gray-500 mb-6 text-sm">Start from scratch and build your CV with our structured editor</p>
              <Button className="bg-black text-lime-300 hover:bg-gray-800">
                Create CV
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-6">
            <div 
              className="border-2 border-dashed border-lime-300 rounded-lg p-6 text-center bg-white cursor-pointer hover:bg-lime-50 transition-colors"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Upload className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag and drop your CV here, or click to browse</h3>
              <p className="text-gray-500 text-sm mb-4">Supported formats: PDF, DOCX, DOC</p>
              <Button variant="outline" className="border-lime-300 text-black hover:bg-lime-50">
                Browse Files
              </Button>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.doc"
                onChange={handleFileInput}
                aria-label="Upload CV file"
                title="Upload CV file"
              />
            </div>
          </CardContent>
        </Card>

        {file && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-6">
              <div className="w-full border border-gray-200 rounded-lg p-4 mb-8 flex items-center justify-between bg-gray-50">
                <div className="flex items-center">
                  <FileType className="h-5 w-5 text-black mr-3" />
                  <div>
                    <p className="font-medium text-left">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                <div>
                  {uploadStatus === 'success' && (
                    <span className="flex items-center text-green-600 text-sm">
                      <Check className="h-4 w-4 mr-1" /> Ready
                    </span>
                  )}
                  {uploadStatus === 'error' && (
                    <span className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" /> Error
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full md:w-auto bg-black hover:bg-gray-800 text-lime-300"
                disabled={!file || isUploading}
                onClick={handleAnalyzeCV}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing CV...
                  </>
                ) : (
                  <>
                    Analyze My CV
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-md font-semibold mb-2">CV Analysis</h3>
              <p className="text-gray-500 text-sm">Get detailed feedback on your CV structure, content, and formatting</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-md font-semibold mb-2">Keyword Optimization</h3>
              <p className="text-gray-500 text-sm">Ensure your CV contains relevant keywords for your target positions</p>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-md font-semibold mb-2">Improvement Suggestions</h3>
              <p className="text-gray-500 text-sm">Receive tailored suggestions to enhance your CV's impact</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
} 