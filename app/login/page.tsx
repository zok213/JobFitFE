"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from '../actions'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  // Demo credentials for direct access
  const demoCredentials = [
    { role: 'Admin', email: 'admin@jobfit.com', password: 'Admin@123456' },
    { role: 'Employer', email: 'employer@jobfit.com', password: 'Employer@123456' },
    { role: 'Employee', email: 'employee@jobfit.com', password: 'Employee@123456' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // AuthContext sẽ tự động chuyển hướng dựa trên role
      await login(email, password);
      // setIsLoading được xử lý trong AuthContext
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setError(null);
    setIsLoading(true);

    try {
      // AuthContext sẽ tự động chuyển hướng dựa trên role
      await login(demoEmail, demoPassword);
      // setIsLoading được xử lý trong AuthContext
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Failed to log in with demo account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
        
        <form action={signIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 