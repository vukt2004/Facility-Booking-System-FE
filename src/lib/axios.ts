import axios from 'axios';

// URL Backend được lấy từ biến môi trường
const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://localhost:7175'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Gắn Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Bóc tách dữ liệu 
api.interceptors.response.use(
  (response) => {
    // Nếu API trả về thành công nhưng errorCode != 0 (tùy quy ước BE của bạn)
    // Giả sử errorCode = 0 là thành công
    const resData = response.data; 
    
    // Trả về trực tiếp phần 'data' bên trong cho gọn code component
    return resData; 
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;