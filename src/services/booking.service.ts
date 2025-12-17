// src/services/booking.service.ts
import axiosClient from '@/api/axiosClient';
import type { ApiResponse, PaginatedResult } from '@/types/backend';

// Enum Status của Booking (0: Pending, 1: Approved, 2: Rejected, 3: Cancelled)
export const BookingStatusEnum = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3
} as const;

export type BookingStatusEnum = typeof BookingStatusEnum[keyof typeof BookingStatusEnum];

// Interface Booking trả về từ API
export interface Booking {
  id: string;
  roomNumber: string;
  roomName: string;
  areaName: string;
  roomTypeName: string;
  startTime: string;
  endTime: string;   
  slotType: string;  
  slotStatus: string; 
  bookingStatus: string; 
  createdAt: string;
  createdBy: string;
}

export interface BookingCreateRequest {
  roomSlotId: string;
  note?: string; // Nếu cần ghi chú
}

export interface BookingStatusUpdateRequest {
  status: number; // Gửi số 3 để hủy
}

export const bookingService = {
  // Lấy danh sách booking (Của user đang login)
  getMyBookings: async (params?: { page?: number; size?: number }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<Booking>>>('/Booking', { params });
  },

  // Tạo booking mới
  createBooking: async (data: BookingCreateRequest) => {
    return axiosClient.post<any, ApiResponse<Booking>>('/Booking', data);
  },

  // Cập nhật trạng thái (Dùng để Hủy - set status = 3)
  updateBookingStatus: async (id: string, status: number) => {
    return axiosClient.put<any, ApiResponse<any>>(`/Booking/${id}/status`, { status });
  },

  // Xóa hẳn booking (Nếu muốn dùng Hard Delete thay vì Soft Delete)
  deleteBooking: async (id: string) => {
    return axiosClient.delete<any, ApiResponse<any>>(`/Booking/${id}`);
  },

  getAllBookings: async (params?: { page?: number; size?: number; keyword?: string }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<Booking>>>('/Booking', { params });
  },
};