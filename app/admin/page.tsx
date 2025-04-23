"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user?.username || user?.email}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Users</h3>
            <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center">
              <i className="fas fa-users text-white"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">1,254</p>
              <p className="text-green-400 text-sm"><i className="fas fa-arrow-up mr-1"></i> 12% from last month</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Jobs Posted</h3>
            <div className="bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center">
              <i className="fas fa-briefcase text-white"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">842</p>
              <p className="text-green-400 text-sm"><i className="fas fa-arrow-up mr-1"></i> 5% from last month</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Revenue</h3>
            <div className="bg-purple-500 h-10 w-10 rounded-full flex items-center justify-center">
              <i className="fas fa-dollar-sign text-white"></i>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white">$24,589</p>
              <p className="text-red-400 text-sm"><i className="fas fa-arrow-down mr-1"></i> 3% from last month</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <button className="text-gray-400 hover:text-white text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className="bg-gray-700 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    <i className={`fas fa-${index % 3 === 0 ? 'user-plus' : index % 3 === 1 ? 'briefcase' : 'credit-card'} text-gray-300`}></i>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {index % 3 === 0 ? 'New user registered' : index % 3 === 1 ? 'New job posted' : 'Subscription upgraded'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {index % 3 === 0 ? 'John Doe registered as an employer.' : 
                       index % 3 === 1 ? 'Tech Company posted a new Senior Developer position.' : 
                       'ABC Corp upgraded to Premium plan.'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{30 - index * 5} minutes ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">System Status</h3>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                Healthy
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">CPU Usage</p>
                <p className="text-gray-300 font-medium">28%</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Memory Usage</p>
                <p className="text-gray-300 font-medium">64%</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">Storage</p>
                <p className="text-gray-300 font-medium">42%</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-300">API Requests</p>
                <p className="text-gray-300 font-medium">5.2k/10k</p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '52%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 