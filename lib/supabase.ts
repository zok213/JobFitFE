import { createClient } from "@supabase/supabase-js";

// Hardcode credentials for troubleshooting
const supabaseUrl = "https://occonractvzmzbfpxhmr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jY29ucmFjdHZ6bXpiZnB4aG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTY1ODcsImV4cCI6MjA2MDQ3MjU4N30.-wx-EIEsAu3NuzzTK_RAyMGzqAk3dHOz4BkGRKgBMV0";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
