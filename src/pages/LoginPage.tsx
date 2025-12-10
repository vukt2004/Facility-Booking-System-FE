import { Button, Checkbox, Form, Input, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('Success:', values);
    
    // Giả lập Login API
    setTimeout(() => {
      setLoading(false);
      message.success('Đăng nhập thành công!');
      // Logic điều hướng (ví dụ):
      // Nếu là admin -> navigate('/admin')
      navigate('/booking'); // Tạm thời chuyển sang trang booking
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#f0f2f5',
      backgroundImage: 'url("https://fpt.edu.vn/Content/images/assets/bg-1.png")', // Ví dụ ảnh nền mờ
      backgroundSize: 'cover',
      position: 'relative'
    }}>
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ position: 'absolute', top: 20, left: 20, fontSize: 18 }}
      >
        Quay lại
      </Button>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: '#f57224', borderRadius: 8, color: '#fff', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>F</div>
          <Title level={3}>Đăng nhập</Title>
          <Text type="secondary">Sử dụng Email FPT Education</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email @fpt.edu.vn" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#f57224', borderColor: '#f57224' }}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

import { useState } from 'react'; // Bổ sung import thiếu
export default LoginPage;