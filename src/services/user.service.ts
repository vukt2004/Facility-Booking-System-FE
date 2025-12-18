// src/services/user.service.ts
import axiosClient from '@/api/axiosClient';
import type { ApiResponse, PaginatedResult } from '@/types/backend';

// [cite: 151] Enum Role dựa trên API
export const UserRole = {
  Student: 2,
  Lecturer: 1,
  Admin: 0
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: number;
}

export const userService = {
  // [cite: 128-132] API lấy danh sách user
  getUsers: async (params?: { page?: number; size?: number; keyword?: string; role?: number }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<User>>>('/user', { params });
  }
};