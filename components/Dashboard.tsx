"use client";

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "./NavBar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { LandingPage } from "./LandingPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { User, Briefcase, FileText, Settings, Bell } from "lucide-react";
import Image from "next/image";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Show loading or redirect if no user
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  // If the user hasn't chosen a role yet, redirect them
  if (!user.role) {
    router.push("/choose-role");
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-24 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500">Welcome, {user.username || user.email}!</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-lime-300 flex items-center justify-center mb-4">
                    <User size={40} className="text-zinc-800" />
                  </div>
                  <h2 className="text-xl font-semibold">{user.username || user.email}</h2>
                  <p className="text-zinc-500 capitalize">{user.role}</p>
                </div>
                
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Jobs
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>
          
          {/* Main content */}
          <main className="lg:w-3/4">
            <Card>
              <CardHeader>
                <CardTitle>{user.role === "employee" ? "My Job Search" : "Recruitment Dashboard"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    {user.role === "employee" ? (
                      <>
                        <div className="bg-lime-100 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-2">Complete Your Profile</h3>
                          <p className="text-zinc-600 mb-4">A complete profile increases your chances of being matched with the right job.</p>
                          <div className="flex items-center">
                            <div className="w-full bg-zinc-200 rounded-full h-2.5">
                              <div className="bg-lime-500 h-2.5 rounded-full w-[45%]"></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-zinc-700">45%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                              <h3 className="font-medium">Job Matches</h3>
                              <p className="text-2xl font-bold">12</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h3 className="font-medium">Applications</h3>
                              <p className="text-2xl font-bold">5</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </div>
                              <h3 className="font-medium">Interviews</h3>
                              <p className="text-2xl font-bold">2</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="flex flex-col">
                          <h3 className="text-lg font-medium mb-4">Recommended Jobs</h3>
                          <div className="space-y-4">
                            {[1, 2, 3].map((job) => (
                              <Card key={job}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium">Senior Frontend Developer</h4>
                                      <p className="text-sm text-zinc-500">TechCorp • Remote • $80k - $120k</p>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">React</span>
                                        <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">TypeScript</span>
                                        <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">Next.js</span>
                                      </div>
                                    </div>
                                    <span className="text-sm px-2 py-1 bg-lime-100 text-lime-800 rounded-full">98% match</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-lime-100 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-2">Active Job Postings</h3>
                          <p className="text-zinc-600 mb-4">You have 3 active job postings with a total of 45 applicants.</p>
                          <Button className="bg-zinc-900 text-lime-300 hover:bg-zinc-800">
                            Post a New Job
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                              </div>
                              <h3 className="font-medium">Job Postings</h3>
                              <p className="text-2xl font-bold">3</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                <User className="h-6 w-6 text-green-600" />
                              </div>
                              <h3 className="font-medium">Total Applicants</h3>
                              <p className="text-2xl font-bold">45</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-4 flex flex-col items-center">
                              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                <Bell className="h-6 w-6 text-purple-600" />
                              </div>
                              <h3 className="font-medium">Interviews Scheduled</h3>
                              <p className="text-2xl font-bold">7</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="flex flex-col">
                          <h3 className="text-lg font-medium mb-4">Top Candidates</h3>
                          <div className="space-y-4">
                            {[1, 2, 3].map((candidate) => (
                              <Card key={candidate}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                      <div className="w-10 h-10 rounded-full bg-zinc-300 flex items-center justify-center">
                                        <User className="h-5 w-5 text-zinc-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">John Doe</h4>
                                        <p className="text-sm text-zinc-500">5 years experience • React Developer</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">React</span>
                                          <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">TypeScript</span>
                                          <span className="px-2 py-1 bg-zinc-100 text-zinc-800 text-xs rounded-full">Node.js</span>
                                        </div>
                                      </div>
                                    </div>
                                    <span className="text-sm px-2 py-1 bg-lime-100 text-lime-800 rounded-full">92% match</span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="stats">
                    <div className="h-80 flex items-center justify-center bg-zinc-100 rounded-lg">
                      <p className="text-zinc-500">Statistics charts will be displayed here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="space-y-4">
                      <div className="border-l-2 border-lime-300 pl-4">
                        <h3 className="font-medium">Applied to Frontend Developer position</h3>
                        <p className="text-sm text-zinc-500">2 hours ago</p>
                      </div>
                      <div className="border-l-2 border-lime-300 pl-4">
                        <h3 className="font-medium">Profile viewed by TechCorp</h3>
                        <p className="text-sm text-zinc-500">Yesterday</p>
                      </div>
                      <div className="border-l-2 border-lime-300 pl-4">
                        <h3 className="font-medium">Resume updated</h3>
                        <p className="text-sm text-zinc-500">3 days ago</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 