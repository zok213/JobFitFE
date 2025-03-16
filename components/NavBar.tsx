"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { Menu, X, User, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: "AI Job Match", href: "#" },
    { name: "AI Resume Assistant", href: "#" },
    { name: "For Employer", href: "#for-employer" },
    { name: "About Us", href: "#about-us" },
    { name: "Blog", href: "#blog" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="relative z-10 bg-white border-b border-gray-100">
      <div className="flex justify-between items-center px-6 md:px-12 lg:px-24 py-6 max-w-[1440px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/img/LOGO.png" 
            alt="JobFit.AI Logo" 
            width={120} 
            height={36} 
            className="w-auto h-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-8 md:gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm md:text-base leading-7 text-black cursor-pointer hover:text-gray-700 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User size={16} />
                  <span>{user.username || user.email}</span>
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="font-medium hover:bg-lime-50 border-2 border-lime-300 hover:border-lime-400 transition-all">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="px-6 py-2 text-sm font-bold bg-black rounded-xl text-white hover:bg-gray-800 transition-all shadow-sm">
                  JOIN NOW
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button 
          className="md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-50">
          <div className="flex flex-col py-4 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-3 text-base text-black hover:text-lime-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="py-3 flex items-center gap-2 text-black hover:text-lime-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="py-3 flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-3">
                <Link 
                  href="/login" 
                  className="py-2 text-center border-2 border-lime-300 rounded-md text-black hover:bg-lime-50 hover:border-lime-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="py-2 text-center bg-black rounded-md text-white hover:bg-gray-800 shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
