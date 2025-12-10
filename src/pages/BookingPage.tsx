import { useState, useMemo } from 'react';
import { Layout, Select, DatePicker, Card, Row, Col, Typography, Tag, Button, Modal, List, message, Badge } from 'antd';
import { EnvironmentOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Import Data & Types
import { MOCK_CAMPUS, MOCK_AREAS, MOCK_ROOMS, MOCK_ROOM_TYPES, MOCK_SLOTS } from '../data/mock';
import { type Room, type RoomSlot, SlotStatus } from '../types';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const BookingPage = () => {
  // --- STATE ---
  const [selectedCampus, setSelectedCampus] = useState<string>(MOCK_CAMPUS[0].id);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // --- FILTER LOGIC ---
  // 1. Lấy danh sách Area theo Campus đã chọn
  const filteredAreas = useMemo(() => 
    MOCK_AREAS.filter(area => area.campusId === selectedCampus), 
  [selectedCampus]);

  // 2. Lấy danh sách Room theo Area đã chọn (nếu chưa chọn Area thì lấy hết phòng thuộc Campus đó)
  const filteredRooms = useMemo(() => {
    const areaIds = selectedArea ? [selectedArea] : filteredAreas.map(a => a.id);
    return MOCK_ROOMS.filter(room => areaIds.includes(room.areaId));
  }, [selectedArea, filteredAreas]);

  // --- HANDLERS ---
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleBooking = (slot: RoomSlot) => {
    if (slot.status !== SlotStatus.AVAILABLE) return;
    
    // Giả lập gọi API Booking
    message.loading({ content: 'Đang xử lý...', key: 'booking' });
    setTimeout(() => {
      message.success({ content: 'Gửi yêu cầu đặt phòng thành công!', key: 'booking' });
      setIsModalOpen(false);
    }, 1000);
  };

  // Helper để lấy tên loại phòng
  const getRoomTypeName = (typeId: string) => MOCK_ROOM_TYPES.find(t => t.id === typeId)?.name || 'Unknown';

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* --- HEADER FILTERS --- */}
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'auto', flexWrap: 'wrap', paddingTop: 12, paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 16 }}>
          <div style={{ width: 32, height: 32, background: '#f57224', borderRadius: 6, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
          <Title level={4} style={{ margin: 0 }}>Booking</Title>
        </div>

        {/* Filter Campus */}
        <Select 
          value={selectedCampus} 
          onChange={(val) => { setSelectedCampus(val); setSelectedArea(null); }}
          style={{ width: 220 }} 
          prefix={<EnvironmentOutlined />}
        >
          {MOCK_CAMPUS.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
        </Select>

        {/* Filter Area */}
        <Select 
          placeholder="Chọn Tòa nhà / Khu vực"
          value={selectedArea}
          onChange={setSelectedArea}
          style={{ width: 200 }}
          allowClear
        >
          {filteredAreas.map(a => <Option key={a.id} value={a.id}>{a.name}</Option>)}
        </Select>

        {/* Filter Date */}
        <DatePicker 
          value={selectedDate} 
          onChange={(date) => setSelectedDate(date || dayjs())}
          format="DD/MM/YYYY" 
          allowClear={false}
        />
      </Header>

      {/* --- MAIN CONTENT (ROOM LIST) --- */}
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>Danh sách phòng trống</Title>
          <Text type="secondary">Hiển thị {filteredRooms.length} kết quả</Text>
        </div>

        <Row gutter={[24, 24]}>
          {filteredRooms.map(room => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    <Tag color="orange" style={{ position: 'absolute', top: 10, right: 10, margin: 0 }}>
                      {getRoomTypeName(room.roomTypeId)}
                    </Tag>
                  </div>
                }
                onClick={() => handleRoomClick(room)}
                bodyStyle={{ padding: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{room.roomName}</Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>{room.roomNumber} - Tầng {room.floor}</Text>
                  </div>
                </div>
                
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#666' }}>
                    <UserOutlined /> {room.capacity}
                  </span>
                  {/* Có thể thêm logic đếm slot trống ở đây */}
                  <Tag color="green">Còn trống</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      {/* --- BOOKING MODAL (SLOT SELECTION) --- */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <ClockCircleOutlined style={{ color: '#f57224' }}/> 
             Đặt lịch: {selectedRoom?.roomName}
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedRoom && (
          <div>
            <div style={{ marginBottom: 20, padding: 12, background: '#f9f9f9', borderRadius: 8 }}>
              <Text strong>Ngày đặt:</Text> {selectedDate.format('DD/MM/YYYY')} <br/>
              <Text strong>Loại phòng:</Text> {getRoomTypeName(selectedRoom.roomTypeId)} <br/>
              <Text strong>Sức chứa:</Text> {selectedRoom.capacity} người
            </div>

            <Title level={5}>Chọn khung giờ (Slot)</Title>
            <List
              dataSource={MOCK_SLOTS.filter(s => s.roomId === selectedRoom.id)} // Lọc slot của phòng này
              renderItem={(slot) => {
                const startTime = dayjs(slot.startAt).format('HH:mm');
                const endTime = dayjs(slot.endAt).format('HH:mm');
                const isAvailable = slot.status === SlotStatus.AVAILABLE;
                
                return (
                  <List.Item
                    actions={[
                      <Button 
                        type={isAvailable ? "primary" : "default"} 
                        disabled={!isAvailable}
                        onClick={() => handleBooking(slot)}
                      >
                        {isAvailable ? "Đặt ngay" : "Không khả dụng"}
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge status={isAvailable ? "success" : "error"} />
                      }
                      title={`${startTime} - ${endTime}`}
                      description={
                        <Text type={isAvailable ? "success" : "secondary"}>
                          {slot.status === SlotStatus.AVAILABLE ? "Đang trống" : slot.status}
                        </Text>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BookingPage;