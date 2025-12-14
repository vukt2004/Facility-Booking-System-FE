import api from '../lib/axios';
import type { LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from '../types';

export const authService = {
  // POST /api/User/Login
  // Return type là LoginResponse (Object chứa token trực tiếp)
  login: async (credentials: LoginRequest) => {
    return await api.post<any, LoginResponse>('/api/User/Login', credentials);
  },

  // Register thường vẫn trả về ApiResponse (hoặc check lại BE)
  register: async (data: RegisterRequest) => {
    return await api.post<any, ApiResponse<any>>('/api/User/Register', data);
  }
};