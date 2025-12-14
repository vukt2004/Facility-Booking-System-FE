import api from '../lib/axios';
import type { Campus, Area, ApiResponse } from '../types';

export const campusService = {
  // [cite: 48] GET /api/Campus?name=...&address=...
  getCampuses: async (page = 1, size = 10, name?: string) => {
    const params = { currentPage: page, pageSize: size, name };
    // Vì axios interceptor đã trả về response.data, nên ở đây ta nhận ApiResponse
    const res = await api.get<ApiResponse<Campus[]>>('/api/Campus', { params });
    return res.data || []; // Trả về mảng Campus
  },

  // [cite: 10] GET /api/Area?campusId=...
  getAreas: async (campusId?: string) => {
    const params = { campusId, page: 1, size: 100 }; // Lấy hết area
    const res = await api.get<ApiResponse<Area[]>>('/api/Area', { params });
    return res.data || [];
  }
};