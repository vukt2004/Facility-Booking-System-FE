import React, { useState } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Tag, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { facilityService, type RoomSlot, RoomSlotStatus, RoomSlotType } from '@/services/facility.service';

const RoomSlotPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();

  // 1. Fetch Dữ liệu Slots
  const { data: slotData, isLoading } = useQuery({
    queryKey: ['roomSlots', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getRoomSlots({
      page: pagination.current,
      size: pagination.pageSize
    }),
  });
  
  const dataSource = slotData?.data?.items || [];
  const totalItems = slotData?.data?.totalItems || 0;

  // 2. Fetch Rooms (để chọn trong Modal và hiển thị tên)
  const { data: roomData } = useQuery({
    queryKey: ['rooms_all'],
    queryFn: () => facilityService.getRooms({ size: 100 }),
  });
  const rooms = roomData?.data?.items || [];

  // 3. Mutation Tạo Slot
  const createMutation = useMutation({
    mutationFn: (values: any) => {
      // Chuẩn hóa dữ liệu trước khi gửi API
      const payload = {
        roomId: values.roomId,
        slotType: values.slotType,
        status: values.status,
        // Chuyển Dayjs object sang ISO string
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
      };
      return facilityService.createRoomSlot(payload);
    },
    onSuccess: () => {
      message.success('Tạo slot thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['roomSlots'] });
    },
    onError: () => message.error('Có lỗi xảy ra khi tạo slot'),
  });

  // Mutation Xóa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteRoomSlot(id),
    onSuccess: () => {
      message.success('Đã xóa slot');
      queryClient.invalidateQueries({ queryKey: ['roomSlots'] });
    },
  });

  // 4. Handlers
  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Helper tìm tên phòng từ ID
  const getRoomName = (id: string) => {
    const room = rooms.find((r: any) => r.id === id);
    return room ? `${room.roomName} (${room.roomNumber})` : id;
  };

  const columns = [
    { 
      title: 'Phòng', 
      dataIndex: 'roomId', 
      key: 'roomId',
      render: (id: string) => <b style={{ color: '#1890ff' }}>{getRoomName(id)}</b>
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => (
        <span>
            {dayjs(text).format('DD/MM/YYYY')} <Tag color="green">{dayjs(text).format('HH:mm')}</Tag>
        </span>
      )
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => (
        <span>
             {dayjs(text).format('DD/MM/YYYY')} <Tag color="red">{dayjs(text).format('HH:mm')}</Tag>
        </span>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'slotType',
      key: 'slotType',
      render: (type: number) => (
        type === RoomSlotType.Block10 ? <Tag color="blue">Block 10 tuần</Tag> : <Tag color="orange">Block 3 tuần</Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        if(status === RoomSlotStatus.Available) return <Tag color="success">Trống</Tag>;
        if(status === RoomSlotStatus.Booked) return <Tag color="volcano">Đã đặt</Tag>;
        return <Tag color="default">Bảo trì</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: RoomSlot) => (
        <Space size="middle">
          <Popconfirm title="Xóa slot này?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Lịch Phòng (Slots)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Tạo Slot Mới
        </Button>
      </div>

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
          showSizeChanger: true
        }}
      />

      <Modal
        title="Tạo Khung Giờ (Slot) Mới"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={(vals) => createMutation.mutate(vals)}>
          <Form.Item 
            name="roomId" 
            label="Chọn Phòng" 
            rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
          >
            <Select placeholder="Chọn phòng..." showSearch optionFilterProp="children">
              {rooms.map((r: any) => (
                <Select.Option key={r.id} value={r.id}>
                    {r.roomName} - {r.roomNumber}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="timeRange" 
            label="Thời gian (Bắt đầu - Kết thúc)" 
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <DatePicker.RangePicker 
                showTime={{ format: 'HH:mm' }} 
                format="DD/MM/YYYY HH:mm" 
                style={{ width: '100%' }}
                placeholder={['Bắt đầu', 'Kết thúc']}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 16 }}>
             <Form.Item 
                name="slotType" 
                label="Loại Slot" 
                initialValue={RoomSlotType.Block10}
                style={{ flex: 1 }}
             >
                <Select>
                    <Select.Option value={RoomSlotType.Block10}>Block 10 tuần</Select.Option>
                    <Select.Option value={RoomSlotType.Block3}>Block 3 tuần</Select.Option>
                </Select>
             </Form.Item>

             <Form.Item 
                name="status" 
                label="Trạng thái ban đầu" 
                initialValue={RoomSlotStatus.Available}
                style={{ flex: 1 }}
             >
                <Select>
                    <Select.Option value={RoomSlotStatus.Available}>Trống (Available)</Select.Option>
                    <Select.Option value={RoomSlotStatus.Maintenance}>Bảo trì</Select.Option>
                </Select>
             </Form.Item>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              Tạo Slot
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomSlotPage;