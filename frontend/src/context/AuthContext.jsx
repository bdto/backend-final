import { createContext, useState, useEffect, useCallback } from 'react';
import { tokenUtils } from '../utils/tokenUtils';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = tokenUtils.getUser();
    const token = tokenUtils.getToken();

    if (storedUser && token && !tokenUtils.isTokenExpired()) {
      setUser(storedUser);
    } else {
      tokenUtils.clearAll();
    }
    setLoading(false);
  }, []);

  // Periodic token expiry check
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenUtils.isTokenExpired() && user) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (username, password) => {
    const data = await authService.login(username, password);
    const userData = {
      username: data.username,
      role: data.role,
    };
    tokenUtils.setToken(data.token);
    tokenUtils.setUser(userData);
    setUser(userData);
    return data;
  }, []);

  const register = useCallback(async (username, password, email) => {
    const data = await authService.register(username, password, email);
    const userData = {
      username: data.username,
      role: data.role,
    };
    tokenUtils.setToken(data.token);
    tokenUtils.setUser(userData);
    setUser(userData);
    return data;
  }, []);

  const logout = useCallback(() => {
    tokenUtils.clearAll();
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user && !tokenUtils.isTokenExpired();

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
