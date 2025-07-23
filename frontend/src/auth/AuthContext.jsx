// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = 'access';
const REFRESH_KEY = 'refresh';

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setTokens = (access, refresh) => {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
};


const decodeUser = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.user_id,
      email: decoded.email,
      name: decoded.name,
      isAdmin: decoded.is_admin,
      isSuperAdmin: decoded.is_super_admin,
      // token: token // keep the original token if needed
    };
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  // Hydrate user from existing token on first load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setUser(token ? decodeUser(token) : null);
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data, status } = await API.post('/api/token/', { email, password });
    if (status === 200) {
      setTokens(data.access, data.refresh);
      setUser(decodeUser(data.access));
    }
    return status;
  };

  const register = async (email, password) => {
    // If your backend returns tokens on register, do the same as login
    const { data, status } = await API.post('/api/user/register/', { email, password });
    if (status === 201) {
      setTokens(data.access, data.refresh);
      setUser(decodeUser(data.access));
    }
    return status;
  };

  const logout = async () => {
    try {
      clearTokens();
      setUser(null);
    } catch {
      alert('Logout failed');
    } // optional

  };

  const value = { user, isLoading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}