import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, theme, Button } from 'antd';
import { UserOutlined, LogoutOutlined, HistoryOutlined, CalendarOutlined, DownOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const { Header, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // MenuDropdown cho User (Góc phải)
  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'Thông tin cá nhân',
        icon: <UserOutlined />,
      },
      {
        type: 'divider',
      } as const, // Ép kiểu để TS không báo lỗi
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  // Các mục menu chính
  const menuItems = [
    {
      key: '/booking',
      label: 'Đặt Phòng',
      icon: <CalendarOutlined />,
      onClick: () => navigate('/booking'),
    },
    {
      key: '/my-bookings',
      label: 'Lịch Sử Đặt',
      icon: <HistoryOutlined />,
      onClick: () => navigate('/my-bookings'),
    },
  ];

  // Xác định menu đang active dựa trên URL hiện tại
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/booking';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: colorBgContainer,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          padding: '0 24px'
        }}
      >
        {/* 1. Logo / Brand */}
        <div 
            style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1890ff', 
                marginRight: 40, 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }}
            onClick={() => navigate('/')}
        >
            <CalendarOutlined /> F-Booking
        </div>

        {/* 2. Menu Ngang (Cho Desktop) */}
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ flex: 1, borderBottom: 'none' }}
        />

        {/* 3. User Info (Góc phải) */}
        <Space>
            {user ? (
                 <Dropdown menu={userMenu} placement="bottomRight">
                    <Button type="text" style={{ height: 64 }}>
                        <Space>
                            <Avatar 
                                style={{ backgroundColor: '#1890ff' }} 
                                icon={<UserOutlined />} 
                                src={user.avatar} // Nếu sau này có avatar
                            >
                                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                            </Avatar>
                            <span style={{ fontWeight: 500 }}>
                                {user.fullName || user.username}
                            </span>
                            <DownOutlined style={{ fontSize: 12 }} />
                        </Space>
                    </Button>
                </Dropdown>
            ) : (
                <Button type="primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </Button>
            )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 36px', backgroundColor: 'transparent' }}>
        <div style={{ maxWidth: 2400, margin: '0 auto', minHeight: 380 }}>
            {/* Đây là nơi nội dung BookingPage / MyBookingPage hiển thị */}
            <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        F-Booking System ©{new Date().getFullYear()} - Dành cho Sinh viên & Giảng viên
      </Footer>
    </Layout>
  );
};

export default MainLayout;