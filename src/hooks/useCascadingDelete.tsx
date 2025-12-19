import { Modal, message } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { facilityService } from '@/services/facility.service';

// Định nghĩa các loại đối tượng có thể xóa
type EntityType = 'Campus' | 'Area' | 'Room' | 'RoomType';

export const useCascadingDelete = () => {
  const queryClient = useQueryClient();

  // Hàm Helper: Lấy dữ liệu liên quan (Scan)
  const scanDependencies = async (id: string, type: EntityType) => {
    let relatedSlots: string[] = [];
    let relatedRooms: string[] = [];
    let relatedAreas: string[] = [];

    try {
      // 1. Lấy toàn bộ dữ liệu cần thiết để đối chiếu (Do API hạn chế filter)
      const [allAreas, allRooms, allSlots] = await Promise.all([
        facilityService.getAreas({ size: 1000 }), // [cite: 12]
        facilityService.getRooms({ size: 1000 }),    // [cite: 60]
        facilityService.getRoomSlots({ size: 1000 }) // [cite: 93]
      ]);

      const areas = allAreas.data?.items || [];
      const rooms = allRooms.data?.items || [];
      const slots = allSlots.data?.items || [];

      // 2. Logic lọc theo từng loại
      if (type === 'Campus') {
        // Tìm Area thuộc Campus
        const areaObjs = areas.filter((a: any) => a.campusId === id || a.area?.campusId === id); // check cấu trúc area trả về
        relatedAreas = areaObjs.map((a: any) => a.id);

        // Tìm Room thuộc các Area trên
        const roomObjs = rooms.filter((r: any) => relatedAreas.includes(r.areaId));
        relatedRooms = roomObjs.map((r: any) => r.id);

        // Tìm Slot thuộc các Room trên
        const slotObjs = slots.filter((s: any) => relatedRooms.includes(s.roomId));
        relatedSlots = slotObjs.map((s: any) => s.id);
      
      } else if (type === 'Area') {
        relatedAreas = [id]; // Chính nó

        // Tìm Room thuộc Area này
        const roomObjs = rooms.filter((r: any) => r.areaId === id);
        relatedRooms = roomObjs.map((r: any) => r.id);

        // Tìm Slot thuộc các Room trên
        const slotObjs = slots.filter((s: any) => relatedRooms.includes(s.roomId));
        relatedSlots = slotObjs.map((s: any) => s.id);

      } else if (type === 'RoomType') {
         // Tìm Room thuộc Type này
         const roomObjs = rooms.filter((r: any) => r.roomTypeId === id);
         relatedRooms = roomObjs.map((r: any) => r.id);

         // Tìm Slot thuộc các Room trên
         const slotObjs = slots.filter((s: any) => relatedRooms.includes(s.roomId));
         relatedSlots = slotObjs.map((s: any) => s.id);

      } else if (type === 'Room') {
        relatedRooms = [id]; // Chính nó

        // Tìm Slot thuộc Room này
        const slotObjs = slots.filter((s: any) => s.roomId === id);
        relatedSlots = slotObjs.map((s: any) => s.id);
      }

    } catch (error) {
      console.error(error);
      message.error('Lỗi khi quét dữ liệu liên quan');
    }

    return { relatedAreas, relatedRooms, relatedSlots };
  };

  // Hàm thực thi xóa (Expose ra ngoài để dùng)
  const handleDelete = async (id: string, type: EntityType, onSuccess?: () => void) => {
    const hideLoading = message.loading('Đang kiểm tra dữ liệu liên quan...', 0);

    // B1: Quét dữ liệu
    const { relatedAreas, relatedRooms, relatedSlots } = await scanDependencies(id, type);
    
    hideLoading();

    // Tính tổng số phần tử con sẽ bị xóa (trừ chính nó ra)
    let totalChildren = 0;
    if (type === 'Campus') totalChildren = relatedAreas.length + relatedRooms.length + relatedSlots.length;
    else if (type === 'Area') totalChildren = relatedRooms.length + relatedSlots.length;
    else if (type === 'RoomType') totalChildren = relatedRooms.length + relatedSlots.length;
    else if (type === 'Room') totalChildren = relatedSlots.length;

    // B2: Xác định nội dung thông báo
    let confirmContent = 'Bạn có chắc chắn muốn xóa mục này?';
    let isCascading = false;

    if (totalChildren > 0) {
      confirmContent = `CẢNH BÁO: Mục này đang chứa ${totalChildren} dữ liệu con (Khu vực, Phòng và Slot). Nếu xóa, toàn bộ dữ liệu con sẽ bị xóa theo. Bạn có chắc chắn?`;
      isCascading = true;
    }

    // B3: Hiện Modal Confirm
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: confirmContent,
      okText: isCascading ? 'Đồng ý xóa tất cả' : 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          message.loading('Đang thực hiện xóa...', 1.5);

          // B4: Thực hiện xóa từ dưới lên (Bottom-Up)
          
          // 1. Xóa hết Slots trước
          if (relatedSlots.length > 0) {
            await Promise.all(relatedSlots.map(slotId => facilityService.deleteRoomSlot(slotId)));
          }

          // 2. Xóa hết Rooms
          // Nếu đang xóa RoomType hoặc Campus/Area thì mới xóa Room
          if (type !== 'Room' && relatedRooms.length > 0) {
             await Promise.all(relatedRooms.map(roomId => facilityService.deleteRoom(roomId)));
          }

          // 3. Xóa hết Areas
          // Chỉ xóa Area nếu đang xóa Campus
          if (type === 'Campus' && relatedAreas.length > 0) {
             await Promise.all(relatedAreas.map(areaId => facilityService.deleteArea(areaId)));
          }

          // 4. Cuối cùng: Xóa chính phần tử cha (Target)
          if (type === 'Campus') await facilityService.deleteCampus(id);
          else if (type === 'Area') await facilityService.deleteArea(id);
          else if (type === 'RoomType') await facilityService.deleteRoomType(id);
          else if (type === 'Room') await facilityService.deleteRoom(id);

          message.success('Đã xóa thành công!');
          
          // Refresh lại data
          queryClient.invalidateQueries(); 
          if (onSuccess) onSuccess();

        } catch (error) {
          message.error('Có lỗi xảy ra trong quá trình xóa.');
          console.error(error);
        }
      }
    });
  };

  return { handleDelete };
};