import api from '../lib/axios';
import type { LoginRequest, ApiResponse } from '../types';

export const authService = {
  //  POST /api/User/Login
  login: async (credentials: LoginRequest) => {
    // Lưu ý: data trả về có thể là Token string hoặc object chứa token
    const response = await api.post<ApiResponse<any>>('/api/User/Login', credentials);
    return response; 
  },
  
  // [cite: 125] POST /api/User/Register
  register: async (data: any) => {
    return await api.post('/api/User/Register', data);
  }
};