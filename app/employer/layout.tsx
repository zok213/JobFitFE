"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import EmployerSidebar from "@/components/EmployerSidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Check if user is authenticated and has employer role
  if (!user || (user.role !== "employer" && user.role !== "admin")) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <EmployerSidebar />
      <main className="flex-1 overflow-y-auto p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
} 