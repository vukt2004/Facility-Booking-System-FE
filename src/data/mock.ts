import { type Area, AreaStatus, type Campus, type Room, type RoomSlot, type RoomType, SlotStatus } from "../types";

// 1. Campus
export const MOCK_CAMPUS: Campus[] = [
  { id: 'c1', name: 'FPTU Hồ Chí Minh (Q9)', address: 'Lô E2a-7, Đường D1, Khu Công nghệ cao, TP. Thủ Đức' },
  { id: 'c2', name: 'FPTU Cần Thơ', address: 'Cầu Rau Răm, Quận Ninh Kiều' },
];

// 2. Areas (Tòa nhà)
export const MOCK_AREAS: Area[] = [
  { id: 'a1', campusId: 'c1', managerId: 'admin1', name: 'Alpha Building', status: AreaStatus.ACTIVE },
  { id: 'a2', campusId: 'c1', managerId: 'admin1', name: 'Beta Building', status: AreaStatus.ACTIVE },
];

// 3. Room Types
export const MOCK_ROOM_TYPES: RoomType[] = [
  { id: 'rt1', name: 'Phòng Họp Nhóm', description: 'Phòng nhỏ cách âm, có TV' },
  { id: 'rt2', name: 'Hội Trường', description: 'Sức chứa lớn, có máy chiếu, âm thanh' },
  { id: 'rt3', name: 'Phòng Lab', description: 'Trang bị máy tính cấu hình cao' },
];

// 4. Rooms
export const MOCK_ROOMS: Room[] = [
  { 
    id: 'r1', roomTypeId: 'rt1', areaId: 'a1', roomNumber: '201', roomName: 'Alpha Meeting 1', floor: 2, capacity: 10,
  },
  { 
    id: 'r2', roomTypeId: 'rt1', areaId: 'a1', roomNumber: '202', roomName: 'Alpha Meeting 2', floor: 2, capacity: 12,
  },
  { 
    id: 'r3', roomTypeId: 'rt3', areaId: 'a2', roomNumber: '305', roomName: 'IoT Lab', floor: 3, capacity: 30,
  },
];

// 5. Room Slots (Giả lập các slot trong ngày)
// Helper tạo ngày hôm nay + giờ
const today = new Date().toISOString().split('T')[0];

export const MOCK_SLOTS: RoomSlot[] = [
  { id: 's1', roomId: 'r1', startAt: `${today}T07:30:00`, endAt: `${today}T09:00:00`, status: SlotStatus.AVAILABLE },
  { id: 's2', roomId: 'r1', startAt: `${today}T09:15:00`, endAt: `${today}T10:45:00`, status: SlotStatus.UNAVAILABLE }, // Đã có người đặt
  { id: 's3', roomId: 'r1', startAt: `${today}T12:30:00`, endAt: `${today}T14:00:00`, status: SlotStatus.AVAILABLE },
  
  { id: 's4', roomId: 'r3', startAt: `${today}T07:30:00`, endAt: `${today}T09:00:00`, status: SlotStatus.MAINTENANCE }, // Bảo trì
  { id: 's5', roomId: 'r3', startAt: `${today}T09:15:00`, endAt: `${today}T10:45:00`, status: SlotStatus.AVAILABLE },
];