import React from 'react';
import { Layout, Typography, Button, Space, Row, Col, Card } from 'antd';
import { LoginOutlined, CalendarOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleAction = () => {
    if (isAuthenticated) {
      if (user?.role === 0) navigate('/admin/dashboard');
      else navigate('/booking');
    } else {
      navigate('/login');
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 50px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
          F-Booking
        </div>
        <Space>
          {isAuthenticated ? (
             <Button type="primary" icon={<CalendarOutlined />} onClick={handleAction}>
                Vào Hệ Thống
             </Button>
          ) : (
            <>
              <Button type="text" onClick={() => navigate('/login')}>Đăng nhập</Button>
              <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/register')}>Đăng ký</Button>
            </>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '50px 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280, borderRadius: 8, textAlign: 'center' }}>
           <Row justify="center" align="middle" style={{ minHeight: '400px' }}>
             <Col span={12}>
                <Title level={1} style={{ color: '#1890ff' }}>Hệ Thống Đặt Phòng Campus</Title>
                <Title level={4}>NVH & HCM Campus</Title>
                <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                  Giải pháp đặt phòng học, phòng Lab, sân thể thao nhanh chóng và tiện lợi dành cho Giảng viên và Sinh viên.
                </Paragraph>
                <Button type="primary" size="large" shape="round" onClick={handleAction} style={{ marginTop: 20 }}>
                  {isAuthenticated ? 'Đặt Phòng Ngay' : 'Bắt Đầu Ngay'}
                </Button>
             </Col>
             <Col span={12}>
                {/* Bạn có thể để ảnh minh họa ở đây */}
                <CalendarOutlined style={{ fontSize: '200px', color: '#bfbfbf' }} />
             </Col>
           </Row>

           <Row gutter={16} style={{ marginTop: 60 }}>
              <Col span={8}>
                <Card title="Đặt lịch nhanh chóng" bordered={false}>
                  Chọn phòng, chọn giờ và đặt chỉ trong 3 bước.
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Quản lý thông minh" bordered={false}>
                  Xem lịch sử, hủy lịch dễ dàng trước giờ sử dụng.
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Hỗ trợ đa nền tảng" bordered={false}>
                  Sử dụng tốt trên cả máy tính và điện thoại.
                </Card>
              </Col>
           </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>F-Booking ©2025 Created by FE Team</Footer>
    </Layout>
  );
};

export default LandingPage;