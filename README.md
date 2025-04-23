# JobFit.AI - AI-Powered Job Matching Platform

JobFit.AI is a modern job matching platform that uses AI to connect job seekers with their ideal roles and employers with their perfect candidates.

## Features

- **AI Job Matching**: Smart algorithms to match candidates with job postings
- **CV Assistant**: AI-powered resume optimization
- **AI Interviewer**: Practice interviews with AI feedback
- **Career Roadmap**: Personalized career development paths
- **Role-Based Access Control**: Separate dashboards for employees, employers, and administrators

## Role-Based Access Control (RBAC)

JobFit.AI implements RBAC with Supabase for authentication and authorization with three distinct user roles:

1. **Admin**: Full access to the admin dashboard with system management capabilities
2. **Employee**: Access to job seeking features including AI job matching, CV assistance, interviewing, and career roadmap
3. **Employer**: Access to recruitment tools including job posting, candidate matching, and analytics

### Demo Accounts

The system comes with pre-configured demo accounts for testing:

- **Admin Account**
  - Email: admin@jobfit.com
  - Password: Admin@123456

- **Employer Account**
  - Email: employer@jobfit.com
  - Password: Employer@123456

- **Employee Account**
  - Email: employee@jobfit.com
  - Password: Employee@123456

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- Supabase account

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jobfit-ai.git
   cd jobfit-ai
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)

4. Set up your Supabase database with the required tables:
   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
     username TEXT,
     role TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- Set up Row Level Security (RLS)
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for profiles
   CREATE POLICY "Public profiles are viewable by everyone."
     ON profiles FOR SELECT
     USING (true);

   CREATE POLICY "Users can insert their own profile."
     ON profiles FOR INSERT
     WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can update their own profile."
     ON profiles FOR UPDATE
     USING (auth.uid() = id);
   ```

5. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

6. Run the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project can be easily deployed on platforms like Vercel or Netlify:

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Set the environment variables in the deployment platform
4. Deploy the application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js Team for the amazing framework
- Supabase for the auth and database solutions
- TailwindCSS for the styling utilities
