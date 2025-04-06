import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && isTokenValid(storedToken)) {
        setToken(storedToken);
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem(USER_KEY);
            setUser(null);
            setError('Invalid user data found');
          }
        }
      } else if (storedToken) {
        // Token exists but is invalid/expired
        logout();
        setError('Session expired. Please login again.');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, userToken) => {
    try {
      if (!userToken || !isTokenValid(userToken)) {
        throw new Error('Invalid authentication token');
      }

      localStorage.setItem(TOKEN_KEY, userToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setError(null);
    navigate('/logout');
  };

  const updateUser = (updatedUserData) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      setError(null);
    } catch (error) {
      console.error('Update user error:', error);
      setError('Failed to update user information');
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isTokenValid,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Only render children once initial auth check is done */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 