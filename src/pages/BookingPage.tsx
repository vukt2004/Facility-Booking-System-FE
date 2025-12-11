import { useState, useMemo } from 'react';
import { Layout, Input, Card, Row, Col, Typography, Button, Modal, List, message, Badge, Segmented, Tabs, Tooltip, Tag } from 'antd';
import { 
  EnvironmentOutlined, 
  SearchOutlined, 
  LaptopOutlined, 
  TeamOutlined, 
  TrophyOutlined, 
  CalendarOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Import tiếng Việt cho ngày tháng

// Import Data & Types
import { MOCK_CAMPUS, MOCK_AREAS, MOCK_ROOMS, MOCK_SLOTS } from '../data/mock';
import { type Room, type RoomSlot, SlotStatus } from '../types';

dayjs.locale('vi');

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// --- COMPONENT CON: THANH CHỌN NGÀY (Visual Date Strip) ---
const DateStrip = ({ selectedDate, onSelect }: { selectedDate: dayjs.Dayjs, onSelect: (d: dayjs.Dayjs) => void }) => {
  // Tạo mảng 7 ngày tới
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => dayjs().add(i, 'day'));
  }, []);

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '10px 0', scrollbarWidth: 'none' }}>
      {days.map((date) => {
        const isSelected = date.isSame(selectedDate, 'day');
        return (
          <div
            key={date.toString()}
            onClick={() => onSelect(date)}
            style={{
              cursor: 'pointer',
              minWidth: 70,
              height: 80,
              borderRadius: 16,
              background: isSelected ? '#f57224' : '#fff',
              color: isSelected ? '#fff' : '#333',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSelected ? '0 4px 12px rgba(245, 114, 36, 0.4)' : '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              border: isSelected ? 'none' : '1px solid #f0f0f0'
            }}
          >
            <Text strong style={{ color: 'inherit', fontSize: 16 }}>{date.format('DD')}</Text>
            <Text style={{ color: 'inherit', fontSize: 12 }}>{date.format('ddd')}</Text>
          </div>
        );
      })}
      <div style={{ 
        minWidth: 70, height: 80, borderRadius: 16, border: '2px dashed #d9d9d9', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', cursor: 'pointer' 
      }}>
        <CalendarOutlined style={{ fontSize: 20 }} />
      </div>
    </div>
  );
};

const BookingPage = () => {
  // --- STATE ---
  const [selectedCampus, setSelectedCampus] = useState<string>(MOCK_CAMPUS[0].id);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // Filter theo loại phòng (Tabs)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // --- FILTER LOGIC (Nâng cao) ---
  const filteredRooms = useMemo(() => {
    let result = MOCK_ROOMS;

    // 1. Filter by Campus (thông qua Area)
    const areaIdsInCampus = MOCK_AREAS.filter(a => a.campusId === selectedCampus).map(a => a.id);
    result = result.filter(r => areaIdsInCampus.includes(r.areaId));

    // 2. Filter by Type (Tabs)
    if (activeTab !== 'all') {
      // Giả sử mapping ID loại phòng: rt1=Meeting, rt2=Hall, rt3=Lab
      // Trong thực tế nên so sánh chính xác ID
      const typeMap: Record<string, string[]> = {
        'meeting': ['rt1', 'rt2'],
        'lab': ['rt3'],
        'sport': ['rt4']
      };
      if (typeMap[activeTab]) {
        result = result.filter(r => typeMap[activeTab].includes(r.roomTypeId));
      }
    }

    // 3. Filter by Search Text
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(r => r.roomName.toLowerCase().includes(lower) || r.roomNumber.toLowerCase().includes(lower));
    }

    return result;
  }, [selectedCampus, activeTab, searchText]);

  // --- HANDLERS ---
  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleBooking = (slot: RoomSlot) => {
    if (slot.status !== SlotStatus.AVAILABLE) return;
    message.loading({ content: 'Đang xử lý...', key: 'booking' });
    setTimeout(() => {
      message.success({ content: 'Gửi yêu cầu thành công!', key: 'booking' });
      setIsModalOpen(false);
    }, 800);
  };

  // Icon mapping cho Tabs
  const items = [
    { key: 'all', label: 'Tất cả', icon: <FilterOutlined /> },
    { key: 'meeting', label: 'Phòng họp', icon: <TeamOutlined /> },
    { key: 'lab', label: 'Phòng Lab', icon: <LaptopOutlined /> },
    { key: 'sport', label: 'Sân bãi', icon: <TrophyOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      
      {/* --- 1. MODERN HEADER --- */}
      <Header style={{ 
        background: '#fff', padding: '16px 24px', height: 'auto', 
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Top Row: Logo & Search & Campus Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #f57224, #ff9c6e)', borderRadius: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>F</div>
               <div>
                 <Title level={4} style={{ margin: 0 }}>Booking</Title>
                 <Text type="secondary" style={{ fontSize: 12 }}>FPT University</Text>
               </div>
            </div>

            {/* Creative: Segmented Control thay cho Select */}
            <div style={{ background: '#f0f0f0', padding: 4, borderRadius: 8 }}>
              <Segmented
                options={MOCK_CAMPUS.map(c => ({ label: c.name, value: c.id }))}
                value={selectedCampus}
                onChange={setSelectedCampus}
                style={{ background: 'transparent', border: 'none' }}
              />
            </div>

            {/* Search Bar - Bo tròn lớn */}
            <Input 
              prefix={<SearchOutlined style={{ color: '#ccc' }} />} 
              placeholder="Tìm phòng (vd: 201, IoT Lab)..." 
              style={{ width: 250, borderRadius: 20, background: '#f5f5f5', border: 'none' }}
              onChange={e => setSearchText(e.target.value)}
              size="large"
            />
          </div>

          {/* Bottom Row: Date Strip & Categories */}
          <Row gutter={24} align="middle">
            <Col xs={24} md={14}>
              <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
            </Col>
            <Col xs={24} md={10}>
              <Tabs 
                defaultActiveKey="all" 
                items={items} 
                onChange={setActiveTab}
                tabBarStyle={{ marginBottom: 0, border: 'none' }}
              />
            </Col>
          </Row>
        </div>
      </Header>

      {/* --- 2. CREATIVE CONTENT GRID --- */}
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Title level={4} style={{ marginBottom: 24, fontWeight: 600 }}>
          {filteredRooms.length} Phòng khả dụng
        </Title>

        <Row gutter={[24, 24]}>
          {filteredRooms.map(room => (
            <Col xs={24} sm={12} md={8} lg={6} key={room.id}>
              {/* Creative: Sử dụng Badge.Ribbon để tạo điểm nhấn */}
              <Badge.Ribbon 
                text={`Tầng ${room.floor}`} 
                color={room.roomTypeId === 'rt3' ? 'cyan' : 'orange'}
              >
                <Card
                  hoverable
                  style={{ borderRadius: 16, overflow: 'hidden', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  cover={
                    <div style={{ position: 'relative', height: 180 }}>
                      <div style={{ 
                        position: 'absolute', bottom: 0, left: 0, right: 0, 
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', 
                        padding: '20px 16px 12px', color: '#fff' 
                      }}>
                        <Title level={5} style={{ color: '#fff', margin: 0 }}>{room.roomName}</Title>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{room.roomNumber}</Text>
                      </div>
                    </div>
                  }
                  onClick={() => handleRoomClick(room)}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                       <Tooltip title="Sức chứa"><Tag icon={<TeamOutlined />} color="blue">{room.capacity}</Tag></Tooltip>
                       <Tooltip title="Điều hòa"><Tag icon={<EnvironmentOutlined />}>AC</Tag></Tooltip>
                    </div>
                    <Button type="primary" shape="circle" icon={<SearchOutlined />} size="small" style={{ background: '#f57224', borderColor: '#f57224' }} />
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </Content>

      {/* --- 3. BOOKING MODAL (Giữ nguyên logic nhưng trau chuốt UI) --- */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={650}
        styles={{ body: { borderRadius: 16, padding: 0, overflow: 'hidden' } }}
        closeIcon={<div style={{ background: '#f0f0f0', borderRadius: '50%', padding: 4, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</div>}
      >
        {selectedRoom && (
          <Row>
            {/* Cột phải: Thông tin */}
            <Col xs={24} sm={14} style={{ padding: 24 }}>
              <Title level={4} style={{ marginTop: 0 }}>{selectedRoom.roomName}</Title>
              <div style={{ marginBottom: 20 }}>
                <Tag color="orange">{dayjs(selectedDate).format('dddd, DD/MM/YYYY')}</Tag>
                <Tag>{selectedRoom.capacity} Người</Tag>
              </div>

              <Text strong style={{ display: 'block', marginBottom: 12 }}>Chọn khung giờ:</Text>
              <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                <List
                  dataSource={MOCK_SLOTS.filter(s => s.roomId === selectedRoom.id)}
                  renderItem={(slot) => {
                    const isAvailable = slot.status === SlotStatus.AVAILABLE;
                    return (
                      <div 
                        onClick={() => handleBooking(slot)}
                        style={{ 
                          padding: '10px 12px', marginBottom: 8, borderRadius: 8,
                          border: `1px solid ${isAvailable ? '#d9d9d9' : '#f0f0f0'}`,
                          background: isAvailable ? '#fff' : '#f9f9f9',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          opacity: isAvailable ? 1 : 0.6,
                          transition: 'all 0.2s'
                        }}
                        className="slot-item" // Có thể thêm css hover
                      >
                         <div>
                            <Text strong>{dayjs(slot.startAt).format('HH:mm')} - {dayjs(slot.endAt).format('HH:mm')}</Text>
                            <div style={{ fontSize: 12, color: isAvailable ? '#52c41a' : '#ff4d4f' }}>
                              {isAvailable ? '• Còn trống' : '• Đã đặt'}
                            </div>
                         </div>
                         {isAvailable && <Button size="small" type="text" style={{ color: '#f57224' }}>Chọn</Button>}
                      </div>
                    );
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </Layout>
  );
};

export default BookingPage;