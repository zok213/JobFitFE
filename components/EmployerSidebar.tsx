import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const EmployerSidebar = () => {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  // Define nav items based on the image provided
  const mainNavItems = [
    { name: 'Dashboard', href: '/employer', icon: 'home' },
    { name: 'Manage Jobs', href: '/employer/jobs', icon: 'briefcase' },
  ];

  const recruitingNavItems = [
    { name: 'Candidates', href: '/employer/candidates', icon: 'users' },
    { name: 'Analytics', href: '/employer/analytics', icon: 'chart-bar' },
  ];

  const accountNavItems = [
    { name: 'Company Profile', href: '/employer/company', icon: 'building' },
    { name: 'Settings', href: '/employer/settings', icon: 'cog' },
  ];

  // Function to check if link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* Logo and branding */}
      <div className="p-5 border-b border-gray-800 flex items-center space-x-3">
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
          <span className="text-xs text-gray-400">Employer</span>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="mt-6 mb-4">
        <p className="px-4 text-xs text-gray-500 uppercase font-semibold">MAIN</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {mainNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

      {/* Recruiting Navigation */}
      <div className="mb-4">
        <p className="px-4 text-xs text-gray-500 uppercase font-semibold">RECRUITING</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {recruitingNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

      {/* Account Navigation */}
      <div className="mb-4">
        <p className="px-4 text-xs text-gray-500 uppercase font-semibold">ACCOUNT</p>
        <nav className="mt-2">
          <div className="px-2 space-y-1">
            {accountNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                  isActive(item.href)
                    ? 'bg-green-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-bold mb-1 text-white">Upgrade to Pro</h4>
          <p className="text-xs mb-3 text-gray-400">Get access to advanced AI tools and unlimited job postings</p>
          <Link 
            href="/pricing" 
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg block text-center"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerSidebar; 