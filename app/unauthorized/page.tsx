"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleRedirect = () => {
    if (!user) {
      router.push('/login');
    } else if (user.role === 'admin') {
      router.push('/admin');
    } else if (user.role === 'employee') {
      router.push('/employee');
    } else if (user.role === 'employer') {
      router.push('/employer');
    } else {
      router.push('/choose-role');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Không có quyền truy cập</h1>
        <p className="text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên hoặc đăng nhập với tài khoản có quyền phù hợp.
        </p>
        <div>
          <Link 
            href="/login"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
} 