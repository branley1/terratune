// In development, we use relative paths because of Vite's proxy
// In production, we use the full API URL
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : '/api';

// Helper function to add authorization header
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return {
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}; 