"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { LinkButton } from "@/components/LinkButton";
import { 
  Users, 
  Briefcase, 
  FileText, 
  BarChart4, 
  ArrowRight,
  UserCheck,
  Building,
  ListChecks
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const shortcuts = [
  {
    id: 1,
    title: "Post a Job",
    description: "Create a new job listing",
    icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
    href: "/employer/jobs/create",
  },
  {
    id: 2,
    title: "Candidates",
    description: "Review applications and candidates",
    icon: <UserCheck className="w-6 h-6 text-green-500" />,
    href: "/employer/candidates",
  },
  {
    id: 3,
    title: "Company Profile",
    description: "Update your company information",
    icon: <Building className="w-6 h-6 text-blue-500" />,
    href: "/employer/profile",
  },
  {
    id: 4,
    title: "Job Listings",
    description: "Manage your active job postings",
    icon: <ListChecks className="w-6 h-6 text-orange-500" />,
    href: "/employer/jobs",
  },
];

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Redirect if not an employer
  useEffect(() => {
    if (user && user.role !== "employer") {
      router.push(`/${user.role}/dashboard`);
    }
  }, [user, router]);

  return (
    <DashboardShell activeNavItem="dashboard" userRole="employer">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Employer Dashboard</h1>

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
          <h2 className="text-xl font-semibold mb-4">Recruiting Overview</h2>
          <Card className="bg-white p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Active Jobs</h3>
                <p className="text-3xl font-bold">12</p>
                <p className="text-green-600 text-sm">↑ 2 new this week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Total Applications</h3>
                <p className="text-3xl font-bold">87</p>
                <p className="text-green-600 text-sm">↑ 14 new this week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Candidates Matched</h3>
                <p className="text-3xl font-bold">35</p>
                <p className="text-green-600 text-sm">↑ 8 new this week</p>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Interviews Scheduled</h3>
                <p className="text-3xl font-bold">7</p>
                <p className="text-green-600 text-sm">↑ 3 new this week</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          <Card className="bg-white overflow-hidden">
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-4 font-medium">Name</th>
                    <th className="text-left pb-4 font-medium">Position</th>
                    <th className="text-left pb-4 font-medium">Match Score</th>
                    <th className="text-left pb-4 font-medium">Date</th>
                    <th className="text-right pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      name: "Nguyen Van A",
                      position: "Frontend Developer",
                      score: 92,
                      date: "2 days ago",
                    },
                    {
                      id: 2,
                      name: "Tran Thi B",
                      position: "UI/UX Designer",
                      score: 87,
                      date: "3 days ago",
                    },
                    {
                      id: 3,
                      name: "Le Van C",
                      position: "Backend Developer",
                      score: 78,
                      date: "1 week ago",
                    },
                  ].map((candidate) => (
                    <tr key={candidate.id} className="border-b border-gray-100">
                      <td className="py-4">{candidate.name}</td>
                      <td className="py-4">{candidate.position}</td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            candidate.score >= 90
                              ? "bg-green-100 text-green-800"
                              : candidate.score >= 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {candidate.score}%
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">{candidate.date}</td>
                      <td className="py-4 text-right">
                        <LinkButton
                          href={`/employer/candidates/${candidate.id}`}
                          variant="ghost"
                          className="text-sm"
                        >
                          View Profile
                        </LinkButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 text-right">
                <LinkButton
                  href="/employer/candidates"
                  variant="link"
                  className="text-sm text-gray-600"
                >
                  View all applications
                </LinkButton>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
} 