import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { UserOutlined, ShopOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

// Mock data cho bảng Booking gần đây
const RECENT_BOOKINGS = [
  { key: '1', user: 'Lê Văn A', room: 'Phòng họp 201', time: '08:00 - 10:00', status: 'pending' },
  { key: '2', user: 'Nguyễn Thị B', room: 'Lab IoT', time: '13:00 - 15:00', status: 'approved' },
  { key: '3', user: 'Trần Văn C', room: 'Hội trường A', time: '09:00 - 11:00', status: 'rejected' },
];

const Dashboard = () => {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Tổng quan hệ thống</h2>
      
      {/* 1. Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#e6f7ff' }}>
            <Statistic title="Tổng số Phòng" value={12} prefix={<ShopOutlined />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#fff7e6' }}>
            <Statistic title="Yêu cầu chờ duyệt" value={5} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#f6ffed' }}>
            <Statistic title="Đã duyệt hôm nay" value={8} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: '#fff1f0' }}>
            <Statistic title="Tổng Users" value={150} prefix={<UserOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      {/* 2. Recent Activity Table */}
      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Yêu cầu đặt phòng mới nhất</h3>
      <Table 
        dataSource={RECENT_BOOKINGS} 
        pagination={false}
        columns={[
          { title: 'Người đặt', dataIndex: 'user', key: 'user' },
          { title: 'Phòng', dataIndex: 'room', key: 'room' },
          { title: 'Thời gian', dataIndex: 'time', key: 'time' },
          { 
            title: 'Trạng thái', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
              const color = status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red';
              return <Tag color={color}>{status.toUpperCase()}</Tag>;
            }
          },
        ]} 
      />
    </div>
  );
};

export default Dashboard;