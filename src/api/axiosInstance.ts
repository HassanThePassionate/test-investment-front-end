import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin_token');
  const userToken = localStorage.getItem('user_token');

  if (adminToken) {
    // Agar admin ka token mila hai
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (userToken) {
    // Agar normal user ka token hai
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default axiosInstance;
