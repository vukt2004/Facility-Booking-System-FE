import api from '../lib/axios';
import type { BookingCreateRequest, Booking, ApiResponse } from '../types';

export const bookingService = {
  // [cite: 33] POST /api/Booking
  createBooking: async (data: BookingCreateRequest) => {
    return await api.post('/api/Booking', data);
  },

  // [cite: 29] GET /api/Booking
  getMyBookings: async (page = 1, size = 10) => {
    const params = { currentPage: page, pageSize: size };
    const res = await api.get<ApiResponse<Booking[]>>('/api/Booking', { params });
    return res.data || [];
  },

  // [cite: 36] PUT /api/Booking/{id}/status (Dành cho Admin duyệt)
  updateStatus: async (id: string, status: number) => {
    return await api.put(`/api/Booking/${id}/status`, { status });
  }
};