// src/pages/Admin/CampusPage.tsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService, type Campus, type CampusCreateRequest } from '@/services/facility.service';
import { handleAfterDelete } from '@/utils/pagination';
import { useCascadingDelete } from '@/hooks/useCascadingDelete';

const CampusPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { handleDelete } = useCascadingDelete();
  
  // State quản lý phân trang
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  // 1. Fetch Data (Kèm tham số phân trang)
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['campuses', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getAllCampuses({
      page: pagination.current, 
      size: pagination.pageSize
    }),
  });

  // --- LOGIC MAP DỮ LIỆU MỚI (FIX LỖI) ---
  // API trả về: { errorCode: 0, data: { items: [...], totalItems: 2, ... } }
  // Chúng ta cần lấy apiResponse.data.items
  
  // Kiểm tra an toàn để tránh lỗi undefined
  const dataSource = apiResponse?.data?.items || [];
  const totalItems = apiResponse?.data?.totalItems || 0;

  // 2. Mutations (Giữ nguyên)
  const createMutation = useMutation({
    mutationFn: (data: CampusCreateRequest) => facilityService.createCampus(data),
    onSuccess: () => {
      message.success('Tạo Campus thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['campuses'] });
    },
    onError: () => message.error('Có lỗi xảy ra'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: CampusCreateRequest }) => 
      facilityService.updateCampus(data.id, data.payload),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['campuses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteCampus(id),
    onSuccess: () => {
      handleAfterDelete(
        queryClient,
        ['campuses'],
        pagination,
        setPagination,
        dataSource.length
      );
    },
  });

  // 3. Handlers (Giữ nguyên)
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Campus) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const onDeleteClick = (campusId: string) => {
    // Chỉ cần gọi 1 dòng này, toàn bộ logic check con/xóa con sẽ tự chạy
    handleDelete(campusId, 'Campus');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: CampusCreateRequest) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Xử lý khi người dùng chuyển trang
  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // 4. Columns (Giữ nguyên)
  const columns = [
    {
      title: 'Tên Campus',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Campus) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: 'blue' }} />} 
            onClick={() => handleEdit(record)}
          />
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
        <h2>Quản lý Campus (Cơ sở)</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={dataSource} 
        rowKey="id" 
        loading={isLoading}
        // Thêm cấu hình phân trang cho Table
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalItems,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={editingId ? "Cập nhật Campus" : "Thêm mới Campus"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="name" 
            label="Tên Campus" 
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Ví dụ: Campus NVH" />
          </Form.Item>
          
          <Form.Item 
            name="address" 
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input placeholder="Ví dụ: 123 Đường ABC..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending || updateMutation.isPending}>
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CampusPage;