import React from 'react';
import { Layout, Menu, Button, theme, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreAddOutlined,
  InsertRowLeftOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Xử lý Logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu items
  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: '/admin/campus',
      icon: <BankOutlined />,
      label: 'Quản lý Campus',
      onClick: () => navigate('/admin/campus'),
    },
    {
      key: '/admin/area', // Chúng ta sẽ làm trang này sau
      icon: <AppstoreOutlined />,
      label: 'Quản lý Khu vực',
      onClick: () => navigate('/admin/area'),
    },
    {
      key: '/admin/room-type',
      icon: <AppstoreAddOutlined />,
      label: 'Quản lý Loại phòng',
      onClick: () => navigate('/admin/room-type'),
    },
    {
      key: '/admin/room',
      icon: <InsertRowLeftOutlined />,
      label: 'Quản lý Phòng',
      onClick: () => navigate('/admin/room'),
    },
    {
      key: '/admin/slots',
      icon: <ClockCircleOutlined />, // Import icon này từ @ant-design/icons
      label: 'Quản lý Slot',
      onClick: () => navigate('/admin/slots'),
    },
    {
      key: '/admin/bookings',
      icon: <CalendarOutlined />,
      label: 'Duyệt Đặt Phòng',
      onClick: () => navigate('/admin/bookings'),
    },
  ];

  const userMenu = {
    items: [
      {
        key: '1',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
      }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Dropdown menu={userMenu}>
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.fullName || 'Admin'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Đây là nơi các trang con (Campus, Dashboard...) sẽ hiển thị */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;