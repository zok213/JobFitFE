// Authentication configuration
import { UserRole } from '@/lib/auth-types';

// Flag to enable mock authentication for development
export const isMockAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';

// Authentication routes
export const authRoutes = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  redirect: {
    [UserRole.ADMIN]: '/admin/dashboard',
    [UserRole.JOBSEEKER]: '/dashboard',
    [UserRole.EMPLOYER]: '/employer/dashboard',
  },
  unauthorized: '/',
};

// Standard authentication error messages
export const authErrors = {
  invalidCredentials: 'Invalid email or password',
  emailAlreadyExists: 'An account with this email already exists',
  passwordMismatch: 'Passwords do not match',
  passwordTooWeak: 'Password is too weak',
  invalidEmail: 'Please enter a valid email address',
  userNotFound: 'User not found',
  passwordResetFailed: 'Password reset failed',
  sessionExpired: 'Your session has expired, please sign in again',
  networkError: 'Network error, please check your connection',
  unknownError: 'An unknown error occurred',
}; 