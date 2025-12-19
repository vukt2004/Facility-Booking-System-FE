// src/pages/Admin/RoomTypePage.tsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService, type RoomType, type RoomTypeCreateRequest } from '@/services/facility.service';
import { handleAfterDelete } from '@/utils/pagination';
import { useCascadingDelete } from '@/hooks/useCascadingDelete';

const RoomTypePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();
  const { handleDelete } = useCascadingDelete();

  // 1. Fetch Data
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['roomTypes', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getRoomTypes({
      currentPage: pagination.current,
      pageSize: pagination.pageSize
    }),
  });

  const dataSource = apiResponse?.data?.items || [];
  const totalItems = apiResponse?.data?.totalItems || 0;

  // 2. Mutations
  const createMutation = useMutation({
    mutationFn: (data: RoomTypeCreateRequest) => facilityService.createRoomType(data),
    onSuccess: () => {
      message.success('Thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
    },
    onError: () => message.error('Lỗi khi lưu loại phòng'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: RoomTypeCreateRequest }) => 
      facilityService.updateRoomType(data.id, data.payload),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteRoomType(id),
    onSuccess: () => {
      message.success('Đã xóa');
      handleAfterDelete(
        queryClient,
        ['roomTypes'], // Key chính (Prefix) để invalidate
        pagination,
        setPagination,
        dataSource.length
      );
    },
  });

  // 3. Handlers
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: RoomType) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: RoomTypeCreateRequest) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

    const onDeleteClick = (typeId: string) => {
    // Logic sẽ tự tìm Room thuộc Type này -> Tìm Slot thuộc Room đó -> Xóa hết
    handleDelete(typeId, 'RoomType');
  };

  const columns = [
    { title: 'Tên Loại Phòng', dataIndex: 'name', key: 'name' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: RoomType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: 'blue' }} />} onClick={() => handleEdit(record)} />
          <Button 
            danger
            type='text' 
            icon={<DeleteOutlined />} 
            onClick={() => onDeleteClick(record.id)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Loại Phòng</h2>
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
          onChange: (p, s) => setPagination({ current: p, pageSize: s })
        }}
      />
      <Modal title={editingId ? "Cập nhật" : "Thêm mới"} open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Tên Loại" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Phòng Lab, Sân bóng..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>Lưu</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomTypePage;