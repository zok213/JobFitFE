"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminLayout({
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

  // Check if user is authenticated and has admin role
  if (!user || user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
} 