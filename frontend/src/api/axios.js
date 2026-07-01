import axios from 'axios';
import toast from 'react-hot-toast';

// Create a single axios instance
const api = axios.create({
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : '/api',
  withCredentials: true, // Crucial for sending and receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : 'A connection error occurred. Please try again.';

    if (status === 401) {
      // Unauthorized: user is not logged in or session expired
      toast.error(message || 'Session expired. Please login.');
      // Note: Redirecting to login can be handled by routing/auth context to avoid infinite toast loops on startup profile checks.
    } else if (status === 403) {
      // Forbidden
      toast.error(message || 'Access denied.');
    } else if (status === 500) {
      // Internal Server Error
      toast.error(message || 'Internal Server Error. Please contact support.');
    } else if (!status) {
      // Network Error
      toast.error('Unable to connect to the server. Please check if backend is running.');
    }

    return Promise.reject(error);
  }
);

export default api;
