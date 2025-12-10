import { Button, Layout, Typography, Card, Row, Col } from 'antd';
import { LoginOutlined, CalendarOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Layout className="layout" style={{ minHeight: '100vh', background: '#fff' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#f57224', borderRadius: 6, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
          <Title level={4} style={{ margin: 0 }}>FPTU Booking</Title>
        </div>
        <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
          Đăng nhập
        </Button>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ background: '#fff7e6', color: '#d46b08', padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>
              👋 Chào mừng học kỳ mới
            </span>
          </div>
          <Title level={1} style={{ fontSize: '3rem', margin: '20px 0' }}>
            Đặt phòng họp & Lab <br /> 
            <span style={{ color: '#f57224' }}>Dễ dàng hơn bao giờ hết</span>
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto 30px' }}>
            Hệ thống đặt lịch thông minh dành riêng cho Giảng viên và Sinh viên FPTU. 
            Check lịch trống và đặt chỗ ngay lập tức.
          </Paragraph>
          <Button type="primary" size="large" shape="round" style={{ height: 50, padding: '0 40px', fontSize: 18 }} onClick={() => navigate('/login')}>
            Đặt phòng ngay
          </Button>
        </div>

        {/* FEATURES */}
        <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <FeatureCard 
                icon={<CalendarOutlined style={{ fontSize: 32, color: '#1890ff' }} />}
                title="Đặt lịch linh hoạt"
                desc="Xem lịch trống theo thời gian thực (Real-time) và đặt chỗ nhanh."
              />
            </Col>
            <Col xs={24} md={8}>
              <FeatureCard 
                icon={<ThunderboltOutlined style={{ fontSize: 32, color: '#faad14' }} />}
                title="Phản hồi tức thì"
                desc="Hệ thống xử lý tự động hoặc Admin phản hồi nhanh qua Email."
              />
            </Col>
            <Col xs={24} md={8}>
              <FeatureCard 
                icon={<SafetyCertificateOutlined style={{ fontSize: 32, color: '#52c41a' }} />}
                title="Quản lý minh bạch"
                desc="Theo dõi lịch sử và trạng thái phòng họp mọi lúc mọi nơi."
              />
            </Col>
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        FPT University ©2025 Created by FPTU Student
      </Footer>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <Card hoverable style={{ height: '100%', borderRadius: 12, textAlign: 'center' }}>
    <div style={{ marginBottom: 16 }}>{icon}</div>
    <Title level={4}>{title}</Title>
    <Paragraph type="secondary">{desc}</Paragraph>
  </Card>
);

export default WelcomePage;