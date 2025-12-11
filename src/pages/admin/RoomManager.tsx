import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MOCK_ROOMS, MOCK_AREAS } from '../../data/mock';

const RoomManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  // Cột bảng
  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      key: 'roomName',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Số phòng',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (cap: number) => <Tag color="blue">{cap} người</Tag>
    },
    {
      title: 'Tầng',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => { setEditingRoom(record); setIsModalOpen(true); }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => message.success('Đã xóa phòng demo')} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>Danh sách Phòng học & Lab</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}>
          Thêm phòng mới
        </Button>
      </div>

      <Table columns={columns} dataSource={MOCK_ROOMS} rowKey="id" />

      {/* Modal Thêm/Sửa */}
      <Modal 
        title={editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng mới"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        onOk={() => { message.success('Lưu thành công!'); setIsModalOpen(false); }}
      >
        <Form layout="vertical" initialValues={editingRoom}>
          <Form.Item label="Tên phòng" name="roomName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Sức chứa" name="capacity">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Khu vực" name="areaId">
            <Select>
              {MOCK_AREAS.map(a => <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManager;