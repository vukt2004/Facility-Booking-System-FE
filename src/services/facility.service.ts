import axiosClient from '@/api/axiosClient';
import type { ApiResponse, PaginatedResult } from '@/types/backend';
import dayjs from 'dayjs';

// --- Enums ---
export const RoomSlotStatus = {
  Available: 0,
  Booked: 1,
  Maintenance: 2
} as const;

export const RoomSlotType = {
  Block10: 0,
  Block3: 1     
} as const;

// --- Interface cho Campus ---
export interface Campus {
  id: string;
  name: string;
  address: string;
  description?: string;
}

export interface CampusCreateRequest {
  name: string;
  address: string;
  description?: string;
}

// --- Interface cho Area ---
export interface Area {
  id: string;
  name: string;
  campusId: string;
  managerId?: string;
}

// --- Interface Area ---
export interface Area {
  id: string;
  name: string;
  campusId: string;
  campusName?: string; // BE có thể trả về hoặc không, tùy actual response
  managerId?: string;
}

export interface AreaCreateRequest {
  campusId: string;
  name: string;
  managerId?: string;
}

// --- Interface RoomType ---
export interface RoomType {
  id: string;
  name: string;
  description?: string;
}

export interface RoomTypeCreateRequest {
  name: string;
  description?: string;
}

export interface Room {
  id: string;
  roomTypeId: string;
  areaId: string;
  roomNumber: string;
  roomName: string;
  floor: number;
  capacity: number;
  description?: string;
  // Các field hiển thị (nếu BE trả về kèm tên)
  areaName?: string; 
  roomTypeName?: string;
}

export interface RoomCreateRequest {
  roomTypeId: string;
  areaId: string;
  roomNumber: string;
  roomName: string;
  floor: number;
  capacity: number;
  description?: string;
}

// --- Interface RoomSlot ---
export interface RoomSlot {
  id: string;
  roomId: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  slotType: typeof RoomSlotType[keyof typeof RoomSlotType];
  status: typeof RoomSlotStatus[keyof typeof RoomSlotStatus];
  // Các field hiển thị (nếu BE có trả về kèm tên phòng)
  roomName?: string; 
}

export interface RoomSlotCreateRequest {
  roomId: string;
  startTime: string; // Cần format ISO 8601
  endTime: string;
  slotType: number;
  status: number;
}

// --- Service ---
export const facilityService = {
  // === CAMPUS ===
  getAllCampuses: async (params?: { name?: string; address?: string; page?: number; size?: number }) => {
    // API: GET /api/Campus
    return axiosClient.get<any, ApiResponse<Campus[]>>('/Campus', { params });
  },

  createCampus: async (data: CampusCreateRequest) => {
    // API: POST /api/Campus
    return axiosClient.post<any, ApiResponse<Campus>>('/Campus', data);
  },

  updateCampus: async (id: string, data: CampusCreateRequest) => {
    // API: PUT /api/Campus/{id}
    return axiosClient.put<any, ApiResponse<Campus>>(`/Campus/${id}`, data);
  },

  deleteCampus: async (id: string) => {
    // API: DELETE /api/Campus/{id}
    return axiosClient.delete<any, ApiResponse<any>>(`/Campus/${id}`);
  },

  // === AREA (Khu vực) ===
  getAreas: async (params?: { campusId?: string; name?: string; page?: number; size?: number }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<Area>>>('/Area', { params });
  },

  createArea: async (data: AreaCreateRequest) => {
    return axiosClient.post<any, ApiResponse<Area>>('/Area', data);
  },

  updateArea: async (id: string, data: AreaCreateRequest) => {
    return axiosClient.put<any, ApiResponse<Area>>(`/Area/${id}`, data);
  },

  deleteArea: async (id: string) => {
    return axiosClient.delete<any, ApiResponse<any>>(`/Area/${id}`);
  },

  // === ROOM TYPE (Loại phòng) ===
  getRoomTypes: async (params?: { name?: string; currentPage?: number; pageSize?: number }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<RoomType>>>('/RoomType', { params });
  },

  createRoomType: async (data: RoomTypeCreateRequest) => {
    return axiosClient.post<any, ApiResponse<RoomType>>('/RoomType', data);
  },

  updateRoomType: async (id: string, data: RoomTypeCreateRequest) => {
    return axiosClient.put<any, ApiResponse<RoomType>>(`/RoomType/${id}`, data);
  },

  deleteRoomType: async (id: string) => {
    return axiosClient.delete<any, ApiResponse<any>>(`/RoomType/${id}`);
  },

  // === ROOM (Phòng) ===
  // [cite: 58-61]
  getRooms: async (params?: { page?: number; size?: number; keyword?: string }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<Room>>>('/Room', { params });
  },

  // [cite: 62-65]
  createRoom: async (data: RoomCreateRequest) => {
    return axiosClient.post<any, ApiResponse<Room>>('/Room', data);
  },

  // [cite: 68-72]
  updateRoom: async (id: string, data: RoomCreateRequest) => {
    return axiosClient.put<any, ApiResponse<Room>>(`/Room/${id}`, data);
  },

  // [cite: 73]
  deleteRoom: async (id: string) => {
    return axiosClient.delete<any, ApiResponse<any>>(`/Room/${id}`);
  },

  // === ROOM SLOT ===
  // [cite: 92-95]
  getRoomSlots: async (params?: { page?: number; size?: number; keyword?: string }) => {
    return axiosClient.get<any, ApiResponse<PaginatedResult<RoomSlot>>>('/RoomSlot', { params });
  },

  // [cite: 99-101]
  createRoomSlot: async (data: RoomSlotCreateRequest) => {
    return axiosClient.post<any, ApiResponse<RoomSlot>>('/RoomSlot', data);
  },

  // [cite: 80-83]
  updateRoomSlot: async (id: string, data: Partial<RoomSlotCreateRequest>) => {
    return axiosClient.put<any, ApiResponse<RoomSlot>>(`/RoomSlot/${id}`, data);
  },

  // [cite: 87-88]
  deleteRoomSlot: async (id: string) => {
    return axiosClient.delete<any, ApiResponse<any>>(`/RoomSlot/${id}`);
  }
};