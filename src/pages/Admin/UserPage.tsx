// src/pages/Admin/UserPage.tsx
import React, { useState } from 'react';
import { Table, Card, Input, Select, Tag, Space, Avatar, Typography } from 'antd';
import { UserOutlined, SearchOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { userService, UserRole } from '@/services/user.service';

const { Title } = Typography;

const UserPage: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [keyword, setKeyword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<number | undefined>(undefined);

  // Fetch Data User
  const { data: userData, isLoading } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize, keyword, selectedRole],
    queryFn: () => userService.getUsers({
      page: pagination.current,
      size: pagination.pageSize,
      keyword: keyword,
      role: selectedRole
    }),
  });

  const dataSource = userData?.data?.items || [];
  const totalItems = userData?.data?.totalItems || 0;

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#888' }}>ID: {record.id.substring(0, 8)}...</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <MailOutlined style={{ color: '#888' }} />
          {text}
        </Space>
      )
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text: string) => text ? (
        <Space>
           <PhoneOutlined style={{ color: '#888' }} /> {text}
        </Space>
      ) : <span style={{ color: '#ccc' }}>Chưa cập nhật</span>
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: number) => {
        if (role === UserRole.Admin) return <Tag color="red">Admin</Tag>;
        if (role === UserRole.Lecturer) return <Tag color="blue">Giảng viên</Tag>;
        return <Tag color="green">Sinh viên</Tag>;
      }
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>Quản lý Người Dùng</Title>
      </div>

      <Card>
        {/* Bộ lọc */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <Input 
                placeholder="Tìm theo tên hoặc email..." 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
            />
            
            <Select
                placeholder="Lọc theo vai trò"
                style={{ width: 200 }}
                allowClear
                onChange={setSelectedRole}
            >
                <Select.Option value={UserRole.Student}>Sinh viên (Student)</Select.Option>
                <Select.Option value={UserRole.Lecturer}>Giảng viên (Lecturer)</Select.Option>
                <Select.Option value={UserRole.Admin}>Admin</Select.Option>
            </Select>
        </div>

        {/* Bảng dữ liệu */}
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
      </Card>
    </div>
  );
};

export default UserPage;