import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const EmployeeSidebar = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  // Define nav items based on the image provided
  const mainNavItems = [
    { name: 'Dashboard', href: '/employee', icon: 'home' },
    { name: 'Profile', href: '/employee/profile', icon: 'user' },
  ];

  const aiToolsNavItems = [
    { name: 'AI Job Match', href: '/employee/job-match', icon: 'project-diagram' },
    { name: 'AI CV Assistant', href: '/employee/cv-assistant', icon: 'file-alt' },
    { name: 'AI Interviewer', href: '/employee/interviewer', icon: 'comments' },
    { name: 'AI Roadmap', href: '/employee/roadmap', icon: 'chart-line' },
  ];

  const preferencesNavItems = [
    { name: 'Settings', href: '/employee/settings', icon: 'cog' },
    { name: 'Help', href: '/employee/help', icon: 'question-circle' },
  ];

  // Function to check if link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and branding */}
      <div className="p-5 flex items-center space-x-3">
        <div className="relative w-8 h-8">
          <Image
            src="/img/logo.png"
            alt="JobFit.AI Logo"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-green-500">JobFit.AI</span>
          <span className="text-xs text-gray-500">Employee</span>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="mt-2 mb-4">
        <p className="px-4 text-xs text-gray-400 uppercase font-semibold">MAIN</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {mainNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${item.icon} w-5`}></i>
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* AI Tools Navigation */}
      <div className="mt-2 mb-4">
        <p className="px-4 text-xs text-gray-400 uppercase font-semibold">AI TOOLS</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {aiToolsNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${item.icon} w-5`}></i>
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Preferences Navigation */}
      <div className="mt-2">
        <p className="px-4 text-xs text-gray-400 uppercase font-semibold">PREFERENCES</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {preferencesNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">
                  <i className={`fas fa-${item.icon} w-5`}></i>
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      {/* Upgrade to Pro */}
      <div className="mt-auto p-4">
        <div className="bg-gray-900 text-white p-4 rounded-lg">
          <h4 className="font-bold mb-1">Upgrade to Pro</h4>
          <p className="text-xs mb-3">Get access to advanced AI tools and unlimited job matches</p>
          <Link 
            href="/pricing" 
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg block text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
      
      {/* Guide Bot */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          href="/employee/help" 
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <div className="bg-green-100 text-green-500 p-2 rounded-full mr-3">
            <i className="fas fa-comment"></i>
          </div>
          <div>
            <p className="font-medium">Guide Bot</p>
            <p className="text-xs text-gray-500">Ask for help anytime</p>
          </div>
        </Link>
        <p className="text-xs text-gray-400 text-center mt-3">JobFit.AI v1.2.0</p>
      </div>
    </div>
  );
};

export default EmployeeSidebar; 