import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/register', {
      email: userData.email,
      name: userData.name,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = async () => {
  // Clear token from secure storage
  await SecureStore.deleteItemAsync('auth_token');
};