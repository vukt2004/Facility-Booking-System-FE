// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponseData } from '@/types/auth.types';

interface AuthState {
  user: AuthResponseData['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: AuthResponseData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (data) => {
        // Lưu token vào LocalStorage để Axios Interceptor tự lấy dùng
        localStorage.setItem('access_token', data.token);
        set({ 
            user: data.user, 
            token: data.token, 
            isAuthenticated: true 
        });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);