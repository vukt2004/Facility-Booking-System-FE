// --- ENUMS ---
export const UserRole = {
  ADMIN: 'Admin',
  LECTURER: 'Lecturer',
  STUDENT: 'Student',
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const BookingStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
} as const;
export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export const SlotStatus = {
  AVAILABLE: 'Available',
  UNAVAILABLE: 'Unavailable',
  MAINTENANCE: 'Maintenance',
} as const;
export type SlotStatus = typeof SlotStatus[keyof typeof SlotStatus];

export const AreaStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;
export type AreaStatus = typeof AreaStatus[keyof typeof AreaStatus];

// --- ENTITIES ---

export interface Campus {
  id: string; // UUID
  name: string;
  address: string;
}

export interface Area {
  id: string; // UUID
  campusId: string;
  managerId: string; // Admin User ID
  name: string;
  status: AreaStatus;
}

export interface RoomType {
  id: string; // UUID
  name: string;
  description: string;
}

export interface Room {
  id: string; // UUID
  roomTypeId: string;
  areaId: string;
  roomNumber: string;
  roomName: string;
  floor: number;
  capacity: number;
}

export interface RoomSlot {
  id: string; // UUID
  roomId: string;
  startAt: string; // ISO DateTime string
  endAt: string; // ISO DateTime string
  type?: string; 
  status: SlotStatus;
}

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  role: UserRole;
  // Password không đưa xuống frontend để bảo mật
}

export interface Booking {
  id: string; // UUID
  userId: string;
  roomSlotId: string;
  roomId: string;
  status: BookingStatus;
  rejectedReason?: string;
}