import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginService, register as registerService } from '../services/auth.service';
import { getProfile, getHistory } from '../services/profile.service';
import api from '../services/api';

export const AuthContext = createContext({
  user: null,
  profile: null,
  history: [],
  isAuthenticated: false,
  loading: true,
  login: () => {},
  register: () => {},
  logout: () => {},
  loadUserData: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const profileData = await getProfile();
      const historyData = await getHistory();
      setProfile(profileData);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password);
      if (data.access_token) {
        await SecureStore.setItemAsync('auth_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        await loadUserData();
        return data;
      }
      throw new Error(data.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerService(userData);
      if (data.access_token) {
        await SecureStore.setItemAsync('auth_token', data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);
        await loadUserData();
        return data;
      }
      throw new Error(data.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setUser(null);
    setProfile(null);
    setHistory([]);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const [profileData, historyData] = await Promise.all([
          getProfile(),
          getHistory()
        ]);
        
        setProfile(profileData);
        setHistory(historyData);
        setIsAuthenticated(true);
        
        const userResponse = await api.get('/user');
        setUser(userResponse.data);
      }
    } catch (err) {
      console.log('Auth verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      history,
      isAuthenticated,
      setIsAuthenticated,
      loading, 
      login, 
      register,
      logout,
      loadUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
