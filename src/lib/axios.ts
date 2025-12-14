import axios from 'axios';

// URL Backend được lấy từ biến môi trường
const BASE_URL = import.meta.env.VITE_BASE_URL; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTOR QUAN TRỌNG
api.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data (chính là cái JSON { errorCode, message, data })
    return response.data; 
  },
  (error) => {
    // Nếu lỗi từ server (vd 400, 500), axios sẽ nhảy vào đây
    // Ta vẫn nên reject để catch bên ngoài bắt được
    return Promise.reject(error);
  }
);

export default api;