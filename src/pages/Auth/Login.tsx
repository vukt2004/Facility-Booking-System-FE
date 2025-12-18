// src/pages/Auth/Login.tsx
import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginRequest } from '@/types/auth.types';
import { decodeUserFromToken } from '@/utils/jwt';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response: any) => {
      // 1. Lấy token
      const token = response?.token || response?.data?.token;

      if (token) {
        message.success('Đăng nhập thành công!');

        // 2. DECODE TOKEN ĐỂ LẤY INFO (Thay vì tự chế object rỗng)
        const userInfo = decodeUserFromToken(token);

        if (userInfo) {
            console.log("User Info decoded:", userInfo);
            
            // 3. Lưu vào Store (Update store user với info xịn)
            setAuth({
                token: token,
                user: {
                    id: userInfo.id,       // <-- Đã có ID thật
                    username: userInfo.email.split('@')[0], 
                    fullName: userInfo.role, // Hoặc lấy từ email
                    email: userInfo.email,
                    role: userInfo.roleId 
                }
            });

            // 4. Điều hướng
            if (userInfo.roleId === 0) { // Admin
                navigate('/admin/dashboard');
            } else {
                navigate('/booking');
            }
        } else {
            message.error('Token không hợp lệ');
        }
      }
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message;
      console.error(error);
      if (errorMsg) {
        message.error(errorMsg);
      } else {
        message.error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    },
  });

  const onFinish = (values: LoginRequest) => {
    loginMutation.mutate(values);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      position: 'relative' 
    }}>

      {/* --- NÚT QUAY LẠI TRANG CHỦ --- */}
      <Button 
        type="text" 
        icon={<HomeOutlined />} 
        onClick={() => navigate('/')}
        style={{ 
            position: 'absolute', 
            top: 20, 
            left: 20, 
            fontSize: '16px',
            color: '#666',
            display: 'flex',
            alignItems: 'center'
        }}
      >
        Trang chủ
      </Button>
      {/* ----------------------------- */}
      
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
            {/* Logo hoặc Tên hệ thống */}
          <Title level={3} style={{ color: '#1890ff' }}>F-Booking</Title>
          <Text type="secondary">Hệ thống đặt phòng Campus NVH & HCM</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="userName" // Khớp với LoginRequest 
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập" 
            />
          </Form.Item>

          <Form.Item
            name="password" // Khớp với LoginRequest [cite: 143]
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loginMutation.isPending}
            >
              Đăng nhập
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
              <Text>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;