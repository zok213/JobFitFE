"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { 
  User, 
  Home, 
  Briefcase, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  ChevronRight,
  Menu,
  X,
  Award,
  LineChart,
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type NavItem = {
  id: string;
  label: string;
  icon?: React.ElementType;
  route?: string;
  active: boolean;
};

interface DashboardShellProps {
  children: ReactNode;
  activeNavItem?: string;
}

export const DashboardShell = ({ children, activeNavItem = "dashboard" }: DashboardShellProps) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for sticky header shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, route: "/dashboard", active: activeNavItem === "dashboard" },
    { id: "profile", label: "Profile", icon: User, route: "/profile", active: activeNavItem === "profile" },
    { 
      id: "job-match", 
      label: "AI Job Match", 
      icon: Briefcase,
      route: "/job-match",
      active: activeNavItem === "job-match" || activeNavItem === "jobmatch"
    },
    { 
      id: "cv-assistant", 
      label: "AI CV Assistant", 
      icon: FileText,
      route: "/cv-assistant", 
      active: activeNavItem === "cv-assistant" || activeNavItem === "cvassistant"
    },
    { 
      id: "interviewer", 
      label: "AI Interviewer", 
      icon: MessageSquare, 
      route: "/interviewer",
      active: activeNavItem === "interviewer" 
    },
    { 
      id: "roadmap", 
      label: "AI Roadmap", 
      icon: LineChart, 
      route: "/roadmap",
      active: activeNavItem === "roadmap" 
    },
    { id: "settings", label: "Settings", icon: Settings, route: "/settings", active: activeNavItem === "settings" },
    { id: "help", label: "Help", icon: HelpCircle, route: "/help", active: activeNavItem === "help" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (item: NavItem) => {
    if (item.route) {
      router.push(item.route);
    }
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile menu background overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Mobile Navigation */}
      <aside 
        className={`w-[250px] bg-white min-h-screen border-r border-gray-200 fixed left-0 top-0 h-full z-50 shadow-sm transition-all duration-300 transform md:translate-x-0 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-center border-b border-gray-100">
          <button 
            onClick={() => router.push("/")} 
            className="transition-transform hover:scale-105 focus:outline-none"
            aria-label="Go to home page"
          >
            <Image 
              src="/img/LOGO.png" 
              alt="JobFit.AI Logo" 
              width={120} 
              height={40}
              className="object-contain"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="py-6">
          <div className="px-5 mb-6">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">MAIN</p>
            <ul className="space-y-1">
              {navItems.slice(0, 2).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-black" : "text-gray-500"}`} />}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-5 mb-6">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">AI TOOLS</p>
            <ul className="space-y-1">
              {navItems.slice(2, 6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-black" : "text-gray-500"}`} />}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-5">
            <p className="text-xs uppercase text-gray-400 font-medium mb-3 ml-1">PREFERENCES</p>
            <ul className="space-y-1">
              {navItems.slice(6).map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      item.active
                        ? "text-black font-medium bg-lime-300"
                        : "text-gray-600 hover:text-black hover:bg-lime-50"
                    }`}
                  >
                    {item.icon && <item.icon className={`w-5 h-5 mr-4 ${item.active ? "text-black" : "text-gray-500"}`} />}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Pro upgrade banner */}
        <div className="px-5 mt-8 mb-8">
          <div className="bg-gradient-to-r from-lime-300/10 to-lime-100/50 rounded-xl p-5 text-black">
            <h3 className="font-bold text-lg mb-1">Upgrade to Pro</h3>
            <p className="text-black/80 text-sm mb-3">Get access to advanced AI tools and unlimited job matches</p>
            <Button 
              className="w-full bg-black text-lime-300 hover:bg-gray-800 transition-all font-medium" 
              onClick={() => router.push("/pricing")}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Issue indicator - positioned at the bottom left of sidebar */}

      {/* Main content */}
      <main className="flex-1 md:ml-[250px]">
        {/* Header */}
        <header className={`bg-white px-4 md:px-8 py-4 sticky top-0 z-20 flex items-center justify-between transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : ''
        }`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button 
              className="w-10 h-10 rounded-full flex md:hidden items-center justify-center bg-gray-50 text-gray-600"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <h1 className="text-xl md:text-2xl font-bold text-black">
              {navItems.find(item => item.active)?.label || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 py-2 w-[220px] bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-lime-300"
              />
            </div>
            
            {/* Notifications */}
            <button 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lime-300 flex items-center justify-center text-black font-medium">
                <span>
                  {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'T'}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-tight mr-1">{user?.username || "testuser"}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-lime-700 leading-tight"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}; 