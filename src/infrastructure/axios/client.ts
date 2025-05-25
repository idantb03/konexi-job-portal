import axios from 'axios';
import { supabase } from '../supabase/client';

const axiosClient = axios.create({
  baseURL: '/api',
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    // Don't get a new session if we're retrying to avoid infinite loops
    if (!config.headers['X-Retry-Count']) {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only retry once and only on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          // Set the retry count header to prevent getting a new session in the request interceptor
          originalRequest.headers['X-Retry-Count'] = 1;
          // Update the auth header
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          // Retry the request
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh auth token:', refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient; 