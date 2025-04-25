"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/LinkButton";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Settings, 
  FileText, 
  BarChart4, 
  ArrowRight 
} from "lucide-react";

const shortcuts = [
  {
    id: 1,
    title: "User Management",
    description: "Manage user accounts and permissions",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    href: "/admin/users",
  },
  {
    id: 2,
    title: "Site Settings",
    description: "Configure site-wide settings",
    icon: <Settings className="w-6 h-6 text-blue-500" />,
    href: "/admin/settings",
  },
  {
    id: 3,
    title: "Resources",
    description: "Manage learning resources",
    icon: <FileText className="w-6 h-6 text-green-500" />,
    href: "/admin/resources",
  },
  {
    id: 4,
    title: "Analytics",
    description: "View site usage and metrics",
    icon: <BarChart4 className="w-6 h-6 text-red-500" />,
    href: "/admin/analytics",
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Redirect if not an admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push(`/${user.role}/dashboard`);
    }
  }, [user, router]);

  return (
    <DashboardShell activeNavItem="dashboard" userRole="admin">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => (
              <Card
                key={shortcut.id}
                className="bg-white overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-lime-300 h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 p-2.5 rounded-full w-fit bg-lime-50">
                    {shortcut.icon}
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {shortcut.title}
                  </CardTitle>
                  <CardDescription className="mt-1 mb-4">
                    {shortcut.description}
                  </CardDescription>
                  <div className="mt-auto pt-2">
                    <LinkButton
                      href={shortcut.href}
                      variant="default"
                      className="w-full justify-between bg-black hover:bg-gray-800 text-lime-300"
                      trailingIcon={<ArrowRight className="h-4 w-4" />}
                      aria-label={`Go to ${shortcut.title}`}
                    >
                      Manage
                    </LinkButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <Card className="bg-white p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Active Users</h3>
                <p className="text-3xl font-bold">328</p>
                <p className="text-green-600 text-sm">↑ 12% from last week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">New Registrations</h3>
                <p className="text-3xl font-bold">48</p>
                <p className="text-green-600 text-sm">↑ 8% from last week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Active Jobs</h3>
                <p className="text-3xl font-bold">124</p>
                <p className="text-red-600 text-sm">↓ 3% from last week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">AI Sessions</h3>
                <p className="text-3xl font-bold">892</p>
                <p className="text-green-600 text-sm">↑ 15% from last week</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
} 