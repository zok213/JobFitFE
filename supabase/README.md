# Supabase Integration for JobFit.AI

This document provides instructions for setting up Supabase authentication with JobFit.AI.

## Project Setup

1. Open the Supabase dashboard at https://app.supabase.com
2. Navigate to your project: **JobFit.AI**
3. Your project URL is: `https://gemushjnbjrffuhajjeh.supabase.co`

## Database Schema

Run the SQL script in `schema.sql` in the Supabase SQL Editor to create:
- A profiles table to store user profile data
- RLS (Row Level Security) policies 
- Triggers to handle new user registrations

## Authentication Setup

1. In the Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled with the following settings:
   - Confirm emails: Enabled 
   - Secure email change: Enabled
   - Custom email templates: Use the default templates or customize as needed

3. Configure password settings:
   - Minimum password length: 8
   - Use strong passwords: Recommended

## Environment Variables

The following environment variables are already configured in your Next.js app:

```
NEXT_PUBLIC_SUPABASE_URL=https://gemushjnbjrffuhajjeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlbXVzaGpuYmpyZmZ1aGFqamVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjEzNDEsImV4cCI6MjA1NzYzNzM0MX0.6fzaRFzhuqo5AzvyS_EPbsJ0wJ0pRgwO1PqO0M9e0qo
```

## Authentication Flow

1. **Sign Up**: Users complete the registration form with their email, username, and password.
2. **Email Verification**: If enabled, users receive a verification email.
3. **Sign In**: Users sign in with their email and password.
4. **Profile Management**: User profiles are stored in the `profiles` table.

## Security

- The JWT Secret for your project is already configured.
- Row Level Security (RLS) protects your database from unauthorized access.
- Avoid committing sensitive API keys to your repository.

## Next Steps

1. Implement social login providers (Google, Facebook, etc.)
2. Add admin roles and permissions
3. Create custom email templates for authentication
4. Add additional profile fields as needed 