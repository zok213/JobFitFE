"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { 
  FileText, Plus, BarChart, RefreshCw, Sparkles, FileEdit, 
  Zap, CheckCircle, ArrowRight, Brain, MessageSquare, FileUp 
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CVAssistantPage() {
  return (
    <DashboardShell activeNavItem="cv-assistant">
      <div className="py-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">CV Assistant</h1>
          <Badge className="bg-lime-100 text-black border-0 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-lime-700" />
            <span>AI Powered</span>
          </Badge>
        </div>
        <p className="text-gray-600 mb-8 text-lg">
          Create, edit, and improve your CV with our AI-powered tools
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/cv-assistant/builder" className="block group">
            <Card className="border border-gray-200 hover:border-lime-300 h-full shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-lime-100 text-xs font-medium text-black px-2 py-1 rounded-bl-md">
                Most Popular
              </span>
              <CardContent className="p-6 pt-10">
                <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4 group-hover:bg-lime-200 transition-colors">
                  <FileText className="h-6 w-6 text-lime-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Create New CV</h2>
                <p className="text-gray-600 mb-4">Build a professional CV from scratch using our AI-powered builder</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Templates</span>
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">ATS Friendly</Badge>
                </div>
                <Button className="w-full mt-4 bg-black text-lime-300 hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Building
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/cv-assistant/editor" className="block group">
            <Card className="border border-gray-200 hover:border-blue-300 h-full shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <FileEdit className="h-6 w-6 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">Edit Existing CV</h2>
                <p className="text-gray-600 mb-4">Modify and improve your existing CV with our AI-powered editor</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span>Smart Edit</span>
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">Quick Format</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300">
                  <FileEdit className="h-4 w-4 mr-2" />
                  Edit CV
                </Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/cv-assistant/analysis" className="block group">
            <Card className="border border-gray-200 hover:border-purple-300 h-full shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <BarChart className="h-6 w-6 text-purple-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3">CV Analysis</h2>
                <p className="text-gray-600 mb-4">Get detailed insights and suggestions to improve your CV with AI</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-2">
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>ATS Score</span>
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">Keyword Analysis</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analyze CV
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">AI CV Enhancement Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border border-gray-200 hover:border-lime-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-lime-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">CV Optimizer</h3>
                  <p className="text-gray-600 text-sm mb-2">AI-tailors your CV for specific job descriptions</p>
                  <Button size="sm" variant="link" className="text-lime-600 p-0 h-auto flex items-center">
                    <span>Optimize Now</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">AI Content Writer</h3>
                  <p className="text-gray-600 text-sm mb-2">Generate professional descriptions for your experience</p>
                  <Button size="sm" variant="link" className="text-blue-600 p-0 h-auto flex items-center">
                    <span>Write Content</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">CV Chat Assistant</h3>
                  <p className="text-gray-600 text-sm mb-2">Ask questions and get guidance on your CV</p>
                  <Button size="sm" variant="link" className="text-purple-600 p-0 h-auto flex items-center">
                    <span>Chat Now</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Resume Sync</h3>
                <p className="text-gray-700 mb-4">Your CV is automatically synced with your job preferences to improve matching accuracy</p>
                <Button size="sm" variant="outline" className="bg-white">
                  View Job Preferences
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-lime-50 border border-lime-200 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-lime-100 flex-shrink-0 flex items-center justify-center">
                <FileUp className="h-5 w-5 text-lime-700" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Import Existing CV</h3>
                <p className="text-gray-700 mb-4">Upload your existing CV to get started with our AI-powered tools</p>
                <Button size="sm" className="bg-black text-lime-300 hover:bg-gray-800">
                  Upload CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
} 