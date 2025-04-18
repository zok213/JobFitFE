import { supabase } from './supabase';
import { logger, logApiRequest } from './debug-utils';

// API base URL - this should be set in environment variables
// For development, we'll use the default backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Check API URL during initialization
if (!process.env.NEXT_PUBLIC_API_URL) {
  logger.warn('NEXT_PUBLIC_API_URL is not defined, using default:', API_BASE_URL);
}

/**
 * Generic API client for making authenticated requests to the backend
 */
class ApiClient {
  /**
   * Get authentication token from Supabase session
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.error('Error getting auth session:', error);
        return null;
      }
      
      return data.session?.access_token || null;
    } catch (error) {
      logger.error('Exception getting auth token:', error);
      return null;
    }
  }

  /**
   * Make an authenticated request to the backend
   */
  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getAuthToken();
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // Add auth token if available
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      logger.warn(`Making unauthenticated request to ${endpoint}`);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return logApiRequest(endpoint, 'GET', null, async () => {
      const response = await this.fetchWithAuth(endpoint);
      
      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return response.json();
    });
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return logApiRequest(endpoint, 'POST', data, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return response.json();
    });
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return logApiRequest(endpoint, 'PUT', data, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return response.json();
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return logApiRequest(endpoint, 'DELETE', null, async () => {
      const response = await this.fetchWithAuth(endpoint, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return response.json();
    });
  }

  /**
   * AI Services
   */
  async generateText(prompt: string, options: any = {}): Promise<any> {
    return this.post<any>('/api/ai/generate', {
      prompt,
      ...options,
    });
  }

  async getEmbedding(text: string, options: any = {}): Promise<any> {
    return this.post<any>('/api/ai/embed', {
      text,
      ...options,
    });
  }

  async listAIProviders(): Promise<string[]> {
    return this.get<string[]>('/api/ai/providers');
  }

  /**
   * Job Match Services
   */
  async uploadCV(formData: FormData): Promise<any> {
    const token = await this.getAuthToken();
    
    const headers = new Headers();
    
    // Add auth token if available
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      logger.warn('Uploading CV without authentication');
    }

    const url = `${API_BASE_URL}/api/resumes/upload`;
    
    return logApiRequest('/api/resumes/upload', 'POST (FormData)', { fileName: formData.get('file')?.toString() }, async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const errorMsg = `API error: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      return response.json();
    });
  }

  async findJobMatches(criteria: any): Promise<any> {
    return this.post<any>('/api/jobs/match', criteria);
  }

  /**
   * Career Roadmap Services
   */
  async generateRoadmap(data: any): Promise<any> {
    return this.post<any>('/api/roadmaps/generate', data);
  }

  async getUserRoadmaps(): Promise<any> {
    return this.get<any>('/api/roadmaps/user');
  }

  /**
   * Interview Services
   */
  async startInterview(jobId: string): Promise<any> {
    return this.post<any>('/api/interviews/start', { jobId });
  }

  async submitInterviewAnswer(interviewId: string, questionId: string, answer: string): Promise<any> {
    return this.post<any>('/api/interviews/answer', {
      interviewId,
      questionId,
      answer,
    });
  }

  /**
   * Health check to confirm API is accessible
   */
  async checkHealth(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (!response.ok) {
        logger.error(`Health check failed: ${response.status}`);
        return { status: 'error' };
      }
      
      return response.json();
    } catch (error) {
      logger.error('API health check failed:', error);
      return { status: 'error' };
    }
  }
}

// Create and export a singleton instance
export const api = new ApiClient(); 