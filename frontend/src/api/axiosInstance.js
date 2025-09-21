import axios from 'axios';

const axiosInstance = axios.create({
  // This is the #1 place to check for errors.
  // Ensure this URL is exactly correct and your backend server is running on this port.
  baseURL: 'http://localhost:5000/api',
});

// This interceptor automatically adds your login token to every API request.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;