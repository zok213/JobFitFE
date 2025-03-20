"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ChevronRight, Building, Briefcase, MapPin, DollarSign, Clock, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";

export function JobDetailsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "TechCorp Inc.",
    location: "London, UK",
    employmentType: "full-time",
    experienceLevel: "mid-level",
    salary: "£60,000 - £80,000",
    remoteOption: true,
    applicationDeadline: "2023-06-30",
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      router.push("/job-match/results");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center">
          <Building className="h-6 w-6 text-black" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
          <p className="text-gray-500">Enter the details of the job you're interested in</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="company" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            Company
          </Label>
          <Input
            id="company"
            placeholder="Company name"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2"
          />
        </div>

        <div>
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Job location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2"
          />
        </div>
        
        <div>
          <Label htmlFor="employmentType" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            Employment Type
          </Label>
          <Select 
            value={formData.employmentType}
            onValueChange={(value) => handleChange('employmentType', value)}
          >
            <SelectTrigger id="employmentType" className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="experienceLevel" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            Experience Level
          </Label>
          <Select 
            value={formData.experienceLevel}
            onValueChange={(value) => handleChange('experienceLevel', value)}
          >
            <SelectTrigger id="experienceLevel" className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry-level">Entry level</SelectItem>
              <SelectItem value="mid-level">Mid level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="salary" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            Salary Range
          </Label>
          <Input
            id="salary"
            placeholder="e.g. £50,000 - £70,000"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2"
          />
        </div>

        <div>
          <Label htmlFor="applicationDeadline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Application Deadline
          </Label>
          <Input
            id="applicationDeadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => handleChange('applicationDeadline', e.target.value)}
            className="bg-gray-50 border-gray-200 focus:border-lime-300 focus:ring-lime-300 mt-2"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-8">
        <Checkbox 
          id="remoteOption" 
          checked={formData.remoteOption}
          onCheckedChange={(checked) => handleChange('remoteOption', Boolean(checked))}
          className="data-[state=checked]:bg-black data-[state=checked]:border-black"
        />
        <label
          htmlFor="remoteOption"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This job allows remote work
        </label>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-600 flex items-center gap-2"
          onClick={() => router.push("/job-match")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          className="bg-black hover:bg-gray-800 text-lime-300 font-medium min-w-[120px]"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 