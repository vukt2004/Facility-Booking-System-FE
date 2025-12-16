// src/services/auth.service.ts
import axiosClient from '@/api/axiosClient';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';

export const authService = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    // Gọi endpoint POST /api/User/Login 
    const response = await axiosClient.post('/User/Login', payload);
    return response as unknown as LoginResponse;
  },
  
  register: async (payload: RegisterRequest) => {
    // API: POST /api/User/Register
    return axiosClient.post('/User/Register', payload);
  }
};