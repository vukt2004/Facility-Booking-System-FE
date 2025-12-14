import api from '../lib/axios';
import type { Room, RoomSlot, ApiResponse } from '../types';

export const roomService = {
  //  GET /api/Room?keyword=...
  getRooms: async (keyword?: string, page = 1, size = 10) => {
    const params = { keyword, page, size };
    const res = await api.get<ApiResponse<Room[]>>('/api/Room', { params });
    return res.data || [];
  },

  //  GET /api/RoomSlot?keyword=...
  // LƯU Ý: API này trong file text chỉ có filter theo "keyword"[cite: 94], không thấy "roomId" hay "date".
  // Bạn cần check lại với BE xem "keyword" có hỗ trợ search theo RoomId không.
  // Nếu không, FE phải fetch hết về rồi tự filter (không tối ưu) hoặc nhờ BE thêm filter.
  getSlots: async (keyword?: string) => {
    const params = { keyword, page: 1, size: 100 };
    const res = await api.get<ApiResponse<RoomSlot[]>>('/api/RoomSlot', { params });
    return res.data || [];
  }
};