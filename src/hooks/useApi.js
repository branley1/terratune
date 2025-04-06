import { useState, useCallback } from 'react';
import { API_URL, getAuthHeaders } from '../config';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        ...getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Check if response has content
      const contentType = response.headers.get('content-type');
      const hasContent = response.headers.get('content-length') !== '0' && 
                        contentType && contentType.includes('application/json');

      if (!response.ok) {
        let errorMessage;
        if (hasContent) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error;
          } catch (jsonError) {
            console.error('Failed to parse error response:', jsonError);
            errorMessage = 'Invalid server response';
          }
        } else {
          errorMessage = response.statusText || 'Request failed';
        }

        if (response.status === 401) {
          throw new Error('Not authorized. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Not authorized to access these resources.');
        } else {
          throw new Error(errorMessage);
        }
      }

      if (!hasContent) {
        return null;
      }

      try {
        const data = await response.json();
        return data;
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      // Don't throw if it's an auth error, just set the error state
      if (!errorMessage.includes('Not authorized')) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}; 