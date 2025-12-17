 // Import từ file bạn đã tạo ở bước trước

// Payload gửi lên server 
export interface LoginRequest {
  userName: string;
  password?: string;
}

export interface AuthResponseData {
  token: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: number;
  };
}

export interface LoginResponse {
  token: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  password?: string;
  email?: string;
  phoneNumber?: string;
  role: number; // 0: Student, 1: Lecturer, 2: Admin
}

// Role Enum để dùng cho dễ nhớ
export const UserRole = {
  Student: 2,
  Lecturer: 1,
  Admin: 0
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];