// src/pages/Admin/BookingApprovalPage.tsx
import React, { useState } from 'react';
import { Table, Tag, Button, Modal, message, Space, Tabs, Tooltip, Input, Card } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { bookingService, BookingStatusEnum, type Booking } from '@/services/booking.service';

const BookingApprovalPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [activeTab, setActiveTab] = useState<string>('Pending'); // Tab mặc định là Chờ duyệt
  const [keyword, setKeyword] = useState<string>('');

  // 1. Fetch Data
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['admin_bookings', pagination.current, pagination.pageSize, keyword],
    queryFn: () => bookingService.getAllBookings({ 
        page: pagination.current, 
        size: pagination.pageSize,
        keyword: keyword // Nếu BE hỗ trợ tìm theo tên phòng/user
    }),
  });

  const allBookings = bookingData?.data?.items || [];
  const totalItems = bookingData?.data?.totalItems || 0;

  // 2. Logic Filter Client-side theo Tabs
  // (Nếu API hỗ trợ filter status thì tốt hơn, nhưng hiện tại ta lọc trên list trả về)
  const filteredDataSource = activeTab === 'All' 
    ? allBookings 
    : allBookings.filter((item: Booking) => item.bookingStatus === activeTab);

  // 3. Mutation Cập nhật trạng thái
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; status: number }) => 
      bookingService.updateBookingStatus(data.id, data.status),
    onSuccess: (_, variables) => {
      const action = variables.status === BookingStatusEnum.Confirmed ? 'Duyệt' : 'Từ chối';
      message.success(`Đã ${action} yêu cầu thành công!`);
      queryClient.invalidateQueries({ queryKey: ['admin_bookings'] });
    },
    onError: () => message.error('Có lỗi xảy ra, vui lòng thử lại.'),
  });

  // Handlers
  const handleApprove = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận duyệt',
      content: 'Bạn có chắc muốn duyệt yêu cầu đặt phòng này?',
      okText: 'Duyệt ngay',
      cancelText: 'Hủy',
      onOk: () => updateStatusMutation.mutate({ id, status: BookingStatusEnum.Confirmed }),
    });
  };

  const handleReject = (id: string) => {
    Modal.confirm({
      title: 'Từ chối yêu cầu',
      content: 'Bạn có chắc muốn từ chối yêu cầu này?',
      okText: 'Từ chối',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: () => updateStatusMutation.mutate({ id, status: BookingStatusEnum.Cancelled }),
    });
  };

  const columns = [
    {
      title: 'Người đặt',
      dataIndex: 'createdBy', // Hoặc userName nếu BE trả về
      key: 'user',
      render: (text: string) => (
        <Space>
           <UserOutlined /> 
           <Tooltip title={text}>
              {/* Cắt ngắn ID nếu nó là GUID dài ngoằng */}
              <span>{text.length > 10 ? text.substring(0, 8) + '...' : text}</span>
           </Tooltip>
        </Space>
      )
    },
    {
      title: 'Thông tin phòng',
      key: 'roomInfo',
      render: (_: any, record: Booking) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>{record.roomName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.areaName} - {record.roomTypeName}
          </div>
        </div>
      )
    },
    {
      title: 'Thời gian sử dụng',
      key: 'time',
      render: (_: any, record: Booking) => (
        <div>
           <div>📅 {dayjs(record.startTime).format('DD/MM/YYYY')}</div>
           <div style={{ fontWeight: 500 }}>
             ⏰ {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
           </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'bookingStatus',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let label = status;

        if (status === 'Pending') { color = 'orange'; label = 'Chờ duyệt'; }
        else if (status === 'Confirmed') { color = 'success'; label = 'Đã duyệt'; }
        else if (status === 'Rejected') { color = 'error'; label = 'Đã từ chối'; }
        else if (status === 'Cancelled') { color = 'gray'; label = 'Đã hủy'; }

        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Booking) => {
        // Chỉ hiện nút duyệt/từ chối nếu trạng thái là "Pending"
        if (record.bookingStatus !== 'Pending') {
           return <span style={{ color: '#ccc' }}>---</span>;
        }

        return (
          <Space>
            <Tooltip title="Duyệt đơn này">
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleApprove(record.id)}
                loading={updateStatusMutation.isPending}
              />
            </Tooltip>
            <Tooltip title="Từ chối đơn này">
              <Button 
                danger 
                size="small" 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleReject(record.id)}
                loading={updateStatusMutation.isPending}
              />
            </Tooltip>
          </Space>
        );
      }
    },
  ];

  // Cấu trúc Tabs
  const tabItems = [
    { label: 'Chờ duyệt', key: 'Pending' },
    { label: 'Đã duyệt', key: 'Confirmed' },
    { label: 'Đã hoàn thành', key: 'Completed' },
    { label: 'Đã hủy', key: 'Cancelled' },
    { label: 'Tất cả', key: 'All' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>📋 Quản lý Duyệt Đơn Đặt Phòng</h2>
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            {/* Tabs Filter */}
            <Tabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                items={tabItems}
                style={{ flex: 1 }}
            />
            
            {/* Search Box */}
            <div style={{ marginLeft: 16, paddingTop: 6 }}>
                <Input.Search 
                    placeholder="Tìm theo phòng..." 
                    onSearch={(val) => setKeyword(val)}
                    enterButton={<SearchOutlined />}
                    allowClear
                />
            </div>
        </div>

        <Table 
            columns={columns} 
            dataSource={filteredDataSource} 
            rowKey="id" 
            loading={isLoading}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: totalItems,
                onChange: (p, s) => setPagination({ current: p, pageSize: s }),
                showSizeChanger: true
            }}
        />
      </Card>
    </div>
  );
};

export default BookingApprovalPage;