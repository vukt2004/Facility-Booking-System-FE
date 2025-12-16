import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, message, Popconfirm, Select, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService, type Room, type RoomCreateRequest } from '@/services/facility.service';

const RoomPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();

  // 1. Fetch Dữ liệu chính: ROOMS
  const { data: roomData, isLoading } = useQuery({
    queryKey: ['rooms', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getRooms({
      page: pagination.current,
      size: pagination.pageSize
    }),
  });
  
  const dataSource = roomData?.data?.items || [];
  const totalItems = roomData?.data?.totalItems || 0;

  // 2. Fetch Dữ liệu phụ (Dropdown): AREAS & ROOM TYPES
  // Lấy size lớn để đảm bảo hiện đủ trong dropdown
  const { data: areaData } = useQuery({
    queryKey: ['areas_all'],
    queryFn: () => facilityService.getAreas({ size: 100 }),
  });
  const areas = areaData?.data?.items || [];

  const { data: typeData } = useQuery({
    queryKey: ['roomTypes_all'],
    queryFn: () => facilityService.getRoomTypes({ pageSize: 100 }),
  });
  const roomTypes = typeData?.data?.items || [];

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: (data: RoomCreateRequest) => facilityService.createRoom(data),
    onSuccess: () => {
      message.success('Tạo phòng thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => message.error('Có lỗi xảy ra'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: RoomCreateRequest }) => 
      facilityService.updateRoom(data.id, data.payload),
    onSuccess: () => {
      message.success('Cập nhật phòng thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteRoom(id),
    onSuccess: () => {
      message.success('Đã xóa phòng');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  // 4. Handlers
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Room) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: RoomCreateRequest) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // 5. Columns Configuration
  const columns = [
    { title: 'Số phòng', dataIndex: 'roomNumber', key: 'roomNumber', width: 100 },
    { title: 'Tên phòng', dataIndex: 'roomName', key: 'roomName' },
    { 
      title: 'Khu vực', 
      dataIndex: 'areaId', 
      key: 'areaId',
      render: (id: string) => {
        // Tự map ID -> Name nếu BE không trả về name
        const area = areas.find((a: any) => a.id === id);
        return area ? <Tag color="blue">{area.name}</Tag> : id;
      }
    },
    { 
      title: 'Loại', 
      dataIndex: 'roomTypeId', 
      key: 'roomTypeId',
      render: (id: string) => {
        const type = roomTypes.find((t: any) => t.id === id);
        return type ? type.name : id;
      }
    },
    { title: 'Tầng', dataIndex: 'floor', key: 'floor', width: 80 },
    { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity', width: 100 },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Room) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: 'blue' }} />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa phòng này?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Phòng</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm mới</Button>
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
        title={editingId ? "Cập nhật Phòng" : "Thêm Phòng Mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700} // Form dài nên để rộng chút
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item 
              name="roomNumber" 
              label="Số phòng (Mã)" 
              rules={[{ required: true }]} 
              style={{ flex: 1 }}
            >
              <Input placeholder="Ví dụ: 201" />
            </Form.Item>
            <Form.Item 
              name="roomName" 
              label="Tên phòng hiển thị" 
              rules={[{ required: true }]}
              style={{ flex: 2 }}
            >
              <Input placeholder="Ví dụ: Phòng Lab AI" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item 
              name="areaId" 
              label="Khu vực" 
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn khu vực">
                {areas.map((a: any) => (
                  <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="roomTypeId" 
              label="Loại phòng" 
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn loại">
                {roomTypes.map((t: any) => (
                  <Select.Option key={t.id} value={t.id}>{t.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item 
              name="floor" 
              label="Tầng" 
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item 
              name="capacity" 
              label="Sức chứa (người)" 
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả thêm">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
              Lưu dữ liệu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomPage;