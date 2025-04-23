"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function EmployerDashboard() {
  const { user } = useAuth();

  // Demo job postings data
  const jobPostings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'Remote',
      department: 'Engineering',
      type: 'Full-time',
      applicants: 28,
      status: 'active',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      location: 'New York, NY',
      department: 'Design',
      type: 'Full-time',
      applicants: 15,
      status: 'active',
      posted: '5 days ago'
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      location: 'Remote',
      department: 'Operations',
      type: 'Contract',
      applicants: 9,
      status: 'active',
      posted: '1 week ago'
    },
    {
      id: 4,
      title: 'Product Manager',
      location: 'San Francisco, CA',
      department: 'Product',
      type: 'Full-time',
      applicants: 0,
      status: 'draft',
      posted: '-'
    }
  ];

  // Top candidates data
  const topCandidates = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Senior Frontend Developer',
      match: 95,
      avatar: '/img/avatars/avatar1.jpg',
      appliedFor: jobPostings[0].title
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'UX/UI Designer',
      match: 92,
      avatar: '/img/avatars/avatar2.jpg',
      appliedFor: jobPostings[1].title
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'DevOps Engineer',
      match: 88,
      avatar: '/img/avatars/avatar3.jpg',
      appliedFor: jobPostings[2].title
    }
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back to your hiring center</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <i className="fas fa-briefcase text-indigo-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4"><i className="fas fa-arrow-up mr-1"></i> 1 more than last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <i className="fas fa-users text-green-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Applicants</p>
              <p className="text-2xl font-bold">52</p>
            </div>
          </div>
          <p className="text-green-500 text-sm mt-4"><i className="fas fa-arrow-up mr-1"></i> 8 new since yesterday</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <i className="fas fa-user-check text-purple-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Interviews</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
          <p className="text-purple-500 text-sm mt-4"><i className="fas fa-calendar mr-1"></i> 3 scheduled this week</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <i className="fas fa-chart-line text-blue-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Talent Pool</p>
              <p className="text-2xl font-bold">187</p>
            </div>
          </div>
          <p className="text-blue-500 text-sm mt-4"><i className="fas fa-arrow-up mr-1"></i> 15% match rate</p>
        </div>
      </div>

      {/* Job Postings */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Job Postings</h2>
          <Link href="/employer/jobs/create" className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm flex items-center">
            <i className="fas fa-plus mr-2"></i>
            Create New Job
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPostings.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{job.applicants}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.posted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/employer/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link href={`/employer/jobs/${job.id}/edit`} className="text-blue-600 hover:text-blue-900">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top Candidates */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Top Candidates</h2>
          <Link href="/employer/candidates" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
            View All Candidates
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden relative mr-4">
                    <Image 
                      src={candidate.avatar} 
                      alt={candidate.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-500">{candidate.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      candidate.match >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {candidate.match}% Match
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Applied for:</span> {candidate.appliedFor}
                  </p>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
                    <i className="far fa-envelope mr-2"></i>
                    Message
                  </button>
                  <Link 
                    href={`/employer/candidates/${candidate.id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 