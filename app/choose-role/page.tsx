"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ChooseRolePage() {
  const { user, setUserRole, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if no user or if user already has a role
  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role) {
        if (user.role === 'admin') {
          router.push('/admin');
        } else if (user.role === 'employee') {
          router.push('/employee');
        } else if (user.role === 'employer') {
          router.push('/employer');
        }
      }
    }
  }, [user, isLoading, router]);

  const handleRoleSelect = async (role: string) => {
    try {
      await setUserRole(role);
      // The auth context will handle redirection based on the selected role
    } catch (error) {
      console.error('Error setting user role:', error);
    }
  };

  if (isLoading || !user || user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image 
                src="/img/logo.png" 
                alt="JobFit.AI Logo"
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Choose Your Role</h2>
          <p className="mt-2 text-sm text-gray-600">
            Select how you want to use JobFit.AI
          </p>
        </div>
        
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Employee Option */}
          <div 
            onClick={() => handleRoleSelect('employee')}
            className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:border-green-500 hover:shadow-md transition cursor-pointer p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                <i className="fas fa-user-tie text-blue-700 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-gray-900">I'm looking for a job</h3>
                <p className="mt-1 text-sm text-gray-500">Find the perfect job match with AI</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Get job recommendations based on your skills and preferences
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Optimize your resume with AI-powered suggestions
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Practice interviews and improve your communication skills
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => handleRoleSelect('employee')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
              >
                Continue as Job Seeker
              </button>
            </div>
          </div>
          
          {/* Employer Option */}
          <div 
            onClick={() => handleRoleSelect('employer')}
            className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:border-green-500 hover:shadow-md transition cursor-pointer p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                <i className="fas fa-building text-purple-700 text-xl"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium text-gray-900">I'm hiring talent</h3>
                <p className="mt-1 text-sm text-gray-500">Find perfect candidates with AI matching</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Post jobs and get AI-matched candidates
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Streamline your recruitment process with smart tools
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-check text-green-500 mt-1"></i>
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Access analytics and insights on your hiring campaigns
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => handleRoleSelect('employer')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors"
              >
                Continue as Employer
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already know what you want?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 