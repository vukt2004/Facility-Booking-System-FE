// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Sử dụng biến môi trường cho baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn token vào mỗi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi chung (401, 403)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Lấy config của request gốc để check URL
    const originalRequest = error.config;

    // Chỉ redirect khi lỗi 401 VÀ request đó KHÔNG PHẢI là login
    if (error.response?.status === 401 && !originalRequest.url.includes('/Login')) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;