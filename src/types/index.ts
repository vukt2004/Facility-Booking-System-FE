// --- WRAPPER RESPONSE ---
export interface ApiResponse<T> {
  errorCode: number; // 
  message: string | null;
  data: T | null;
}

// --- ENUMS [cite: 146, 153, 154] ---
export const UserRole = {
  Admin: 0,
  Lecturer: 1,
  Student: 2
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const RoomSlotStatus = {
  Available: 0,
  Unavailable: 1,
  Maintenance: 2
} as const;
export type RoomSlotStatus = typeof RoomSlotStatus[keyof typeof RoomSlotStatus];

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  Cancelled: 2,
  Completed: 3
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const RoomSlotType = {
  Block3: 0,
  Block10: 1,
} as const;
export type RoomSlotType = typeof RoomSlotType[keyof typeof RoomSlotType];

// --- ENTITIES ---

export interface Campus {
  id: string;
  name: string;
  address: string;
  description?: string;
}

export interface Area {
  id: string;
  campusId: string;
  managerId: string;
  name: string;
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
}

export interface RoomSlot {
  id: string; // [cite: 75]
  roomId: string;
  startTime: string; // date-time [cite: 151]
  endTime: string;   // date-time
  slotType: number;
  status: RoomSlotStatus;
}

export interface Booking {
  id: string;
  roomSlotId: string;
  note?: string;
  // Các trường khác BE có thể trả về trong data nhưng không define trong request
  status?: BookingStatus;
}

// --- REQUEST DTOS ---
export interface LoginRequest {
  userName?: string; // [cite: 142]
  password?: string;
}

export interface BookingCreateRequest {
  roomSlotId: string; // [cite: 134]
}