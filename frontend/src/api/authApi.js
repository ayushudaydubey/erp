import api from './axios';

// Register User
export const registerUserApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login User
export const loginUserApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Logout User
export const logoutUserApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Get Current User Profile (Me)
export const getMeApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
