// src/pages/User/MyBookingPage.tsx
import React, { useState } from 'react';
import { Table, Tag } from 'antd'; // Bỏ các import Button, Popconfirm, Tooltip
import { useQuery } from '@tanstack/react-query'; // Bỏ useMutation
import dayjs from 'dayjs';
import { bookingService, type Booking } from '@/services/booking.service';

const MyBookingPage: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // 1. Fetch Data (Chỉ lấy dữ liệu để xem)
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['my_bookings', pagination.current],
    queryFn: () => bookingService.getMyBookings({ page: pagination.current, size: pagination.pageSize }),
  });

  const dataSource = bookingData?.data?.items || [];
  const totalItems = bookingData?.data?.totalItems || 0;

  const columns = [
    {
      title: 'Phòng',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text: string, record: Booking) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.areaName} - {record.roomNumber}</div>
        </div>
      )
    },
    {
      title: 'Ngày sử dụng',
      dataIndex: 'startTime',
      key: 'date',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{dayjs(text).format('DD/MM/YYYY')}</span>,
    },
    {
      title: 'Khung giờ',
      key: 'time',
      render: (_: any, record: Booking) => (
        <span>
          {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
        </span>
      ),
    },
    {
      title: 'Loại Slot',
      dataIndex: 'slotType',
      key: 'slotType',
      render: (type: string) => <Tag color="cyan">{type}</Tag>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'bookingStatus',
      key: 'bookingStatus',
      render: (status: string) => {
        // Map màu sắc hiển thị cho đẹp
        let color = 'default';
        let label = status;

        if (status === 'Pending') { color = 'orange'; label = 'Đang chờ duyệt'; }
        else if (status === 'Confirmed') { color = 'success'; label = 'Đã duyệt'; } // Xanh lá
        else if (status === 'Completed') { color = 'yellow'; label = 'Đã hoàn thành'; }
        else if (status === 'Cancelled') { color = 'default'; label = 'Đã hủy'; } // Xám

        return <Tag color={color} style={{ minWidth: 80, textAlign: 'center' }}>{label}</Tag>;
      }
    },
    // Đã xóa cột "Hành động"
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Lịch Sử Đặt Phòng Của Tôi</h2>
      
      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id" 
        loading={isLoading}
        pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalItems,
            onChange: (p, s) => setPagination({ current: p, pageSize: s }),
            showSizeChanger: false // Ẩn tùy chọn số dòng/trang cho gọn nếu muốn
        }}
        bordered // Thêm viền cho bảng dễ nhìn hơn
      />
    </div>
  );
};

export default MyBookingPage;