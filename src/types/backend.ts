// Dựa trên Schema [cite: 128 - 158]

export interface ApiResponse<T> {
  errorCode: number;
  message?: string;
  data?: T;
}

export const Role = {
  Admin: 0,
  Lecturer: 1,
  Student: 2
} as const;

export type Role = typeof Role[keyof typeof Role];

// 
export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

// 
export interface RoomRequest {
  roomTypeId?: string;
  areaId?: string;
  roomNumber?: string;
  roomName?: string;
  floor: number;
  capacity: number;
  description?: string;
}

// [cite: 152]
export interface RoomSlot {
  id: string; // ID thường có trong response dù schema create không có
  roomId?: string;
  startTime: string; // format: date-time
  endTime: string;   // format: date-time
  slotType: number;
  status: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: number; // 0: Student, 1: Lecturer, 2: Admin
}

// Token response thường sẽ có dạng này (tùy chỉnh lại nếu BE trả về khác)
export interface LoginResponse {
  token: string;
  role: string;
}

export interface PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: T[]; // Đây là chỗ chứa mảng dữ liệu thực
}