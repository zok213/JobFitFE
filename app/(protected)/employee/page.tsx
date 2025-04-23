"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function EmployeeDashboard() {
  const { user } = useAuth();

  // Card data for job matches
  const jobMatches = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations',
      location: 'Remote',
      salary: '$95,000 - $120,000',
      match: 95,
      logo: '/img/companies/company1.png',
      skills: ['React', 'TypeScript', 'Next.js']
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Digital Solutions',
      location: 'New York, NY',
      salary: '$110,000 - $140,000',
      match: 89,
      logo: '/img/companies/company2.png',
      skills: ['Node.js', 'React', 'MongoDB']
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'San Francisco, CA',
      salary: '$85,000 - $105,000',
      match: 82,
      logo: '/img/companies/company3.png',
      skills: ['Figma', 'Adobe XD', 'User Research']
    }
  ];

  // AI Tools cards
  const aiTools = [
    {
      id: 'job-match',
      title: 'AI Job Match',
      description: 'Find your perfect job with our AI-powered matching algorithm',
      icon: 'project-diagram',
      color: 'bg-blue-500',
      path: '/employee/job-match'
    },
    {
      id: 'cv-assistant',
      title: 'AI CV Assistant',
      description: 'Optimize your resume with AI recommendations',
      icon: 'file-alt',
      color: 'bg-purple-500',
      path: '/employee/cv-assistant'
    },
    {
      id: 'interviewer',
      title: 'AI Interviewer',
      description: 'Practice interviews with our AI interviewer',
      icon: 'comments',
      color: 'bg-amber-500',
      path: '/employee/interviewer'
    },
    {
      id: 'roadmap',
      title: 'AI Career Roadmap',
      description: 'Get a personalized career roadmap',
      icon: 'chart-line',
      color: 'bg-green-500',
      path: '/employee/roadmap'
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username || 'there'}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your job search progress</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-eye text-blue-500"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Profile Views</p>
              <p className="text-2xl font-bold">148</p>
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4"><i className="fas fa-arrow-up mr-1"></i> 12% from last week</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-briefcase text-green-500"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Job Matches</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4"><i className="fas fa-arrow-up mr-1"></i> 3 new since yesterday</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <i className="fas fa-paper-plane text-amber-500"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Applications</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
          <p className="text-amber-500 text-sm mt-4"><i className="fas fa-circle mr-1"></i> 2 pending responses</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-comments text-purple-500"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Interviews</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
          <p className="text-purple-500 text-sm mt-4"><i className="fas fa-calendar mr-1"></i> Next: Tomorrow, 2:00 PM</p>
        </div>
      </div>

      {/* Top Job Matches */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Job Matches</h2>
          <Link href="/employee/job-match" className="text-green-500 hover:text-green-600 font-medium text-sm">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobMatches.map(job => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 mr-4">
                    <Image 
                      src={job.logo} 
                      alt={`${job.company} logo`} 
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.match >= 90 ? 'bg-green-100 text-green-800' : 
                    job.match >= 80 ? 'bg-blue-100 text-blue-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {job.match}% Match
                  </span>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mt-4">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
                
                <div className="mt-4 flex items-center text-gray-500 text-sm">
                  <span className="flex items-center mr-4">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-dollar-sign mr-2"></i>
                    {job.salary}
                  </span>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between">
                <button className="text-gray-500 hover:text-gray-700">
                  <i className="far fa-bookmark mr-2"></i>
                  Save
                </button>
                <Link 
                  href={`/employee/job-match/${job.id}`} 
                  className="text-green-500 hover:text-green-700 font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Tools */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">AI Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTools.map(tool => (
            <Link
              key={tool.id}
              href={tool.path}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`${tool.color} h-12 w-12 rounded-full flex items-center justify-center mb-4`}>
                <i className={`fas fa-${tool.icon} text-white text-xl`}></i>
              </div>
              <h3 className="font-bold text-gray-900">{tool.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{tool.description}</p>
              <div className="mt-4 text-sm font-medium text-green-500">
                Try Now <i className="fas fa-arrow-right ml-1"></i>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
