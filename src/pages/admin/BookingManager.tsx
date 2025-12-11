import { Table, Tag, Button, Space, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Dữ liệu giả lập các request đang chờ
const MOCK_REQUESTS = [
  { id: 'b1', user: 'Student A', room: 'Meeting Room 201', date: '2025-10-25', time: '08:00 - 10:00', purpose: 'Họp nhóm đồ án', status: 'pending' },
  { id: 'b2', user: 'Lecturer B', room: 'Hall A', date: '2025-10-26', time: '13:00 - 15:00', purpose: 'Training Workshop', status: 'pending' },
  { id: 'b3', user: 'Student C', room: 'Lab IoT', date: '2025-10-25', time: '09:00 - 11:00', purpose: 'Nghiên cứu', status: 'approved' },
];

const BookingManager = () => {
  const handleApprove = (id: string) => message.success(`Đã duyệt booking ${id}`);
  const handleReject = (id: string) => message.info(`Đã từ chối booking ${id}`);

  const columns = [
    { title: 'Người đặt', dataIndex: 'user', key: 'user' },
    { title: 'Phòng', dataIndex: 'room', key: 'room' },
    { 
      title: 'Thời gian', 
      key: 'time',
      render: (record: any) => (
        <div>
          <div>{dayjs(record.date).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: 12, color: '#888' }}>{record.time}</div>
        </div>
      )
    },
    { title: 'Mục đích', dataIndex: 'purpose', key: 'purpose' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        record.status === 'pending' ? (
          <Space>
            <Button 
              type="primary" size="small" icon={<CheckOutlined />} 
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => handleApprove(record.id)}
            >
              Duyệt
            </Button>
            <Popconfirm title="Bạn chắc chắn muốn từ chối?" onConfirm={() => handleReject(record.id)}>
              <Button type="primary" danger size="small" icon={<CloseOutlined />}>Từ chối</Button>
            </Popconfirm>
          </Space>
        ) : <span style={{ color: '#ccc' }}>Đã xử lý</span>
      )
    }
  ];

  return (
    <div>
      <h2>Quản lý Yêu cầu đặt phòng</h2>
      <Table dataSource={MOCK_REQUESTS} columns={columns} rowKey="id" />
    </div>
  );
};

export default BookingManager;