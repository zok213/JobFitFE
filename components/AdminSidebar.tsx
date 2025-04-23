import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: 'home' },
    { name: 'Users', href: '/admin/users', icon: 'users' },
    { name: 'Analytics', href: '/admin/analytics', icon: 'chart-bar' },
    { name: 'Jobs', href: '/admin/jobs', icon: 'briefcase' },
    { name: 'Settings', href: '/admin/settings', icon: 'cog' },
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
          <span className="text-xs text-gray-400">Admin</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <div className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                isActive(item.href)
                  ? 'bg-gray-800 text-white'
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
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => logout()}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg"
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 