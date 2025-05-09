// profile.service.jsx
import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch history' };
  }
};

export const addTrip = async (tripData) => {
  try {
    const response = await api.post('/history', tripData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add trip' };
  }
};