'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const TOKEN_STORAGE_KEY = 'finifi_auth_token';

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Token lives in localStorage, so it's only readable client-side after mount —
  // isInitializing lets the protected layout hold off on redirecting until this
  // first read has actually happened.
  useEffect(() => {
    setTokenState(localStorage.getItem(TOKEN_STORAGE_KEY));
    setIsInitializing(false);
  }, []);

  const setToken = (newToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated: Boolean(token), isInitializing, setToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
