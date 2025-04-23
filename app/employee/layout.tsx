"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import EmployeeSidebar from "@/components/EmployeeSidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EmployeeLayout({
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

  // Check if user is authenticated and has employee role
  if (!user || (user.role !== "employee" && user.role !== "admin")) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <EmployeeSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
} 