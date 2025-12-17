import React, { useState, useMemo } from 'react';
import { Select, Button, Modal, message, Table, Space, Typography, Tooltip, Empty, Tag } from 'antd';
import { LeftOutlined, RightOutlined, AppstoreOutlined, FilterOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { facilityService, RoomSlotStatusEnum, type Room, type RoomSlot } from '@/services/facility.service';
import { bookingService } from '@/services/booking.service';
import { useNavigate } from 'react-router-dom';

dayjs.extend(isBetween);

const { Title } = Typography;

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // --- STATE ---
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('week').add(1, 'day')); // Bắt đầu Thứ 2
  const [selectedSlotType, setSelectedSlotType] = useState<string | undefined>(undefined); // Keyword lọc loại slot

  // --- 1. FETCH DATA ---

  // A. Lấy TẤT CẢ Phòng (Để hiển thị cột bên trái)
  const { data: roomData } = useQuery({
    queryKey: ['rooms_all_user'], 
    queryFn: () => facilityService.getRooms({ size: 500 }), // Lấy số lượng lớn
  });
  const allRooms = roomData?.data?.items || [];

  // B. Lấy Slots (Gọi API getRoomSlots với keyword)
  const { data: slotData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['slots_weekly', selectedSlotType], 
    queryFn: () => facilityService.getRoomSlots({ 
        size: 1000, 
        keyword: selectedSlotType 
    }), 
  });
  const allSlots = slotData?.data?.items || [];

  // --- 2. XỬ LÝ DATA ---

  const scheduleData = useMemo(() => {
    // Bước 1: Tạo Map chứa Slot để tra cứu cho nhanh
    // Cấu trúc: Map<roomId, { '2025-01-01': [slot1, slot2] }>
    const slotsByRoomMap = new Map<string, Record<string, RoomSlot[]>>();

    allSlots.forEach((slot: RoomSlot) => {
       // Filter: Chỉ lấy slot Available
       // Lưu ý: So sánh string chính xác
       if (slot.status !== 'Available') return; 

       if (!slotsByRoomMap.has(slot.roomId)) {
           slotsByRoomMap.set(slot.roomId, {});
       }
       
       const roomSlots = slotsByRoomMap.get(slot.roomId)!;
       const dateKey = dayjs(slot.startTime).format('YYYY-MM-DD');

       if (!roomSlots[dateKey]) {
           roomSlots[dateKey] = [];
       }
       roomSlots[dateKey].push(slot);
    });

    // Bước 2: Map qua danh sách TẤT CẢ PHÒNG để tạo row cho bảng
    // Dù phòng không có slot nào cũng vẫn hiển thị dòng phòng đó
    return allRooms.map((room: any) => {
        const slotsForThisRoom = slotsByRoomMap.get(room.id) || {};
        
        return {
            key: room.id,
            roomId: room.id,
            roomName: room.roomName,
            capacity: room.capacity,
            areaName: room.areaName,
            slotsByDate: slotsForThisRoom // Gắn slot vào phòng (nếu có)
        };
    });
  }, [allSlots, allRooms]);

  // --- 3. BOOKING ACTION ---
  const bookingMutation = useMutation({
    mutationFn: (slotId: string) => bookingService.createBooking({ roomSlotId: slotId }),
    onSuccess: () => {
      message.success('Gửi yêu cầu thành công!');
      queryClient.invalidateQueries({ queryKey: ['slots_weekly'] });
      Modal.confirm({
          title: 'Đặt phòng thành công',
          content: 'Bạn có muốn xem danh sách đơn đã đặt không?',
          okText: 'Xem Lịch Sử',
          cancelText: 'Đóng',
          onOk: () => navigate('/my-bookings')
      });
    },
    onError: (err: any) => message.error(err.response?.data?.message || 'Lỗi đặt phòng'),
  });

  const handleBook = (slot: any) => {
    Modal.confirm({
      title: `Đặt phòng ${slot.roomName || ''}`,
      icon: <CalendarOutlined style={{ color: '#1890ff' }} />,
      content: (
        <div style={{ marginTop: 12 }}>
            <div style={{ marginBottom: 8 }}><strong>Ngày:</strong> {dayjs(slot.startTime).format('DD/MM/YYYY')}</div>
            <div style={{ marginBottom: 8 }}>
                <strong>Thời gian:</strong> <Tag color="blue" style={{ fontSize: 14 }}>
                    {dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
                </Tag>
            </div>
            <div><strong>Loại:</strong> {slot.slotType}</div>
        </div>
      ),
      okText: 'Xác nhận Đặt',
      onOk: () => bookingMutation.mutate(slot.id),
    });
  };

  // --- 4. CẤU HÌNH CỘT ---
  const columns: any[] = [
    {
      title: <div style={{ textAlign: 'center' }}>Phòng</div>,
      dataIndex: 'roomName',
      key: 'roomInfo',
      fixed: 'left',
      width: 150,
      render: (text: string, record: any) => (
          <div style={{ paddingLeft: 8 }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, color: '#1890ff' }}>{text}</div>
              <div style={{ fontSize: 12, color: '#666' }}>
                  {record.areaName ? `${record.areaName} • ` : ''} 
                  <UserOutlined /> {record.capacity || 0}
              </div>
          </div>
      )
    }
  ];

  for (let i = 0; i < 7; i++) {
      const currentDate = startOfWeek.add(i, 'day');
      const dateKey = currentDate.format('YYYY-MM-DD');
      const isToday = currentDate.isSame(dayjs(), 'day');

      columns.push({
          title: (
              <div style={{ 
                  textAlign: 'center', 
                  background: isToday ? '#e6f7ff' : 'transparent',
                  padding: '8px 0',
                  borderBottom: isToday ? '2px solid #1890ff' : 'none'
              }}>
                  <div style={{ fontWeight: isToday ? 'bold' : 500, color: isToday ? '#1890ff' : '#555' }}>
                      {currentDate.format('dddd')}
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>{currentDate.format('DD/MM')}</div>
              </div>
          ),
          key: dateKey,
          width: 180,
          render: (_: any, record: any) => {
              const slots = record.slotsByDate[dateKey] || [];
              slots.sort((a: any, b: any) => dayjs(a.startTime).diff(dayjs(b.startTime)));

              if (slots.length === 0) return null;

              return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 4 }}>
                      {slots.map((slot: any) => {
                          const isBlock3 = slot.slotType === 'Block3';
                          return (
                              <Tooltip key={slot.id} title={`Click để đặt: ${slot.slotType}`} placement="top">
                                  <Button 
                                      type={isBlock3 ? 'primary' : 'default'}
                                      ghost={isBlock3}
                                      block
                                      style={{ 
                                          textAlign: 'center', 
                                          fontSize: '12px', 
                                          height: 'auto', 
                                          padding: '4px 0',
                                          borderRadius: 6,
                                          border: isBlock3 ? '1px solid #1890ff' : '1px solid #d9d9d9',
                                          backgroundColor: isBlock3 ? '#e6f7ff' : '#fff'
                                      }}
                                      onClick={() => handleBook(slot)}
                                  >
                                      <div style={{ fontWeight: 600 }}>
                                          {dayjs(slot.startTime).format('HH:mm')} - {dayjs(slot.endTime).format('HH:mm')}
                                      </div>
                                      <div style={{ fontSize: 10, opacity: 0.8 }}>{slot.slotType}</div>
                                  </Button>
                              </Tooltip>
                          );
                      })}
                  </div>
              );
          }
      });
  }

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER TOOLBAR */}
      <div style={{ 
          padding: '16px 24px', 
          background: '#fff', 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AppstoreOutlined /> Lịch Phòng
              </Title>
              
              {/* Filter Slot Type Only */}
              <Select 
                  placeholder="Loại Slot (Keyword)" 
                  style={{ width: 180 }}
                  onChange={setSelectedSlotType}
                  allowClear
                  suffixIcon={<FilterOutlined />}
              >
                  <Select.Option value="Block3">Block 3</Select.Option>
                  <Select.Option value="Block10">Block 10</Select.Option>
              </Select>
          </div>

          {/* Date Navigation */}
          <Space>
              <Button icon={<LeftOutlined />} onClick={() => setStartOfWeek(d => d.subtract(1, 'week'))} />
              <div style={{ 
                  padding: '4px 16px', 
                  background: '#f5f5f5', 
                  borderRadius: 6, 
                  fontWeight: 600,
                  fontSize: 15 
              }}>
                  {startOfWeek.format('DD/MM')} - {startOfWeek.add(6, 'day').format('DD/MM/YYYY')}
              </div>
              <Button icon={<RightOutlined />} onClick={() => setStartOfWeek(d => d.add(1, 'week'))} />
              <Button type="primary" ghost onClick={() => setStartOfWeek(dayjs().startOf('week').add(1, 'day'))}>
                  Hôm nay
              </Button>
          </Space>
      </div>

      {/* BODY TABLE */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px 24px 24px', background: '#fff' }}>
          <Table
            dataSource={scheduleData}
            columns={columns}
            rowKey="roomId"
            loading={isLoadingSlots}
            scroll={{ 
                x: 'max-content',
                y: 'calc(100vh - 220px)'
            }}
            pagination={false}
            bordered
            size="middle"
            locale={{ emptyText: <Empty description="Không có lịch trống trong tuần này" /> }}
          />
      </div>
    </div>
  );
};

export default BookingPage;