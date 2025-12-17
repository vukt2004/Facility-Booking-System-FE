// src/pages/Admin/AreaPage.tsx
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facilityService, type Area, type AreaCreateRequest } from '@/services/facility.service';
import { useAuthStore } from '@/store/useAuthStore';
import { handleAfterDelete } from '@/utils/pagination';

const AreaPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // 1. Fetch Area Data
  const { data: areaData, isLoading } = useQuery({
    queryKey: ['areas', pagination.current, pagination.pageSize],
    queryFn: () => facilityService.getAreas({ 
      page: pagination.current, 
      size: pagination.pageSize 
    }),
  });
  
  const dataSource = areaData?.data?.items || [];
  const totalItems = areaData?.data?.totalItems || 0;

  // 2. Fetch Campus Data (Để hiển thị trong Dropdown Select)
  const { data: campusData } = useQuery({
    queryKey: ['campuses_all'], // Key khác để tránh conflict với trang Campus
    queryFn: () => facilityService.getAllCampuses({ size: 100 }), // Lấy nhiều để hiện hết trong select
  });
  const campuses = campusData?.data?.items || [];

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: (data: AreaCreateRequest) => facilityService.createArea(data),
    onSuccess: () => {
      message.success('Tạo Area thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
    onError: () => message.error('Lỗi khi tạo Area'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: AreaCreateRequest }) => 
      facilityService.updateArea(data.id, data.payload),
    onSuccess: () => {
      message.success('Cập nhật thành công');
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['areas'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => facilityService.deleteArea(id),
    onSuccess: () => {
      message.success('Đã xóa Area');
      handleAfterDelete(
        queryClient,
        ['areas'], // Key chính (Prefix) để invalidate
        pagination,
        setPagination,
        dataSource.length
      );
    },
  });

  // 4. Handlers
  const handleAdd = () => {
    setEditingId(null);
    setIsModalOpen(true); // 1. Mở Modal lên trước

    // 2. Dùng setTimeout để đẩy việc điền dữ liệu xuống cuối hàng đợi (sau khi Modal đã render xong)
    setTimeout(() => {
        form.resetFields(); // Xóa trắng form cũ
        
        // Kiểm tra xem user có tồn tại không từ store
        if (user && user.id) {
            console.log("Auto-filling ManagerID:", user.id); // Log để kiểm tra
            
            form.setFieldsValue({
                managerId: user.id // 3. Điền ID vào ô input
            });
        }
    }, 100); // Chờ 100ms (rất nhanh mắt thường không thấy)
  };

  const handleEdit = (record: Area) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: AreaCreateRequest) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns = [
    { title: 'Tên Khu Vực', dataIndex: 'name', key: 'name' },
    { 
      title: 'Thuộc Campus', 
      dataIndex: 'campusId', 
      key: 'campusId',
      render: (campusId: string) => {
        // Map ID sang Tên để hiển thị cho đẹp
        const campus = campuses.find((c: any) => c.id === campusId);
        return campus ? campus.name : campusId;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Area) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined style={{ color: 'blue' }} />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa khu vực này?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button type="text" icon={<DeleteOutlined style={{ color: 'red' }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Quản lý Khu vực (Area)</h2>
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
      <Modal title={editingId ? "Cập nhật Area" : "Thêm mới Area"} open={isModalOpen} onCancel={handleCloseModal} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item 
            name="campusId" 
            label="Thuộc Campus" 
            rules={[{ required: true, message: 'Vui lòng chọn Campus' }]}
          >
            <Select placeholder="Chọn Campus">
              {campuses.map((c: any) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Tên Khu Vực" rules={[{ required: true }]}>
            <Input placeholder="Ví dụ: Tòa nhà Alpha" />
          </Form.Item>

          <Form.Item name="managerId" label="Manager ID" rules={[{ required: true }]} hidden>
            <Input placeholder="ID người quản lý khu vực" />
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

export default AreaPage;