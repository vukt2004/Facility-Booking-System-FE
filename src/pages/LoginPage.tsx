import { useState } from 'react';
import { Button, Checkbox, Form, Input, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons'; 
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await authService.login({
        userName: values.email, // Lấy giá trị email gán vào userName
        password: values.password
      });

      // Kiểm tra token (như logic chúng ta đã sửa trước đó)
      if (res && res.token) {
        message.success('Đăng nhập thành công!');
        
        localStorage.setItem('token', res.token);
        
        // Lưu role (tùy biến theo response thực tế)
        if (res.role) {
            localStorage.setItem('role', res.role);
            const role = String(res.role).toLowerCase().trim();
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/booking');
            }
        } else {
             // Fallback nếu không có role
             navigate('/booking');
        }

      } else {
        message.error('Không nhận được token xác thực!');
      }

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại!';
      message.error(typeof errorMsg === 'string' ? errorMsg : 'Lỗi kết nối!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#f0f2f5',
      backgroundSize: 'cover'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: '#f57224', borderRadius: 8, color: '#fff', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>F</div>
          <Title level={3}>Đăng nhập</Title>
          <Text type="secondary">Hệ thống đặt phòng FPTU</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          {/* ĐỔI NAME THÀNH EMAIL ĐỂ VALIDATE */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email FPT!' },
              { type: 'email', message: 'Email không hợp lệ!' } // Validate đúng chuẩn email
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email @fpt.edu.vn" />
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

          <div style={{ textAlign: 'center' }}>
            Chưa có tài khoản? <Link to="/register" style={{ color: '#f57224' }}>Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;