// src/pages/Auth/Login.tsx
import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginRequest } from '@/types/auth.types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response: any) => { // Dùng any tạm thời hoặc LoginResponse mới
      console.log("🔥 API RESPONSE:", response);

      // 1. Kiểm tra Token trực tiếp
      if (response && response.token) {
        message.success('Đăng nhập thành công!');

        // 2. Map Role từ String sang Number (để lưu vào Store cho thống nhất với Swagger)
        // Swagger định nghĩa: 0=Student, 1=Lecturer, 2=Admin 
        let roleEnum = 0; 
        if (response.role === "Admin") roleEnum = 2;
        else if (response.role === "Lecturer") roleEnum = 1;
        else roleEnum = 0; // Mặc định là Student

        // 3. Lưu vào Store
        // Vì response thực tế thiếu thông tin user (id, name), ta tự decode token hoặc lưu tạm
        setAuth({
          token: response.token,
          user: {
            id: "", // Response này thiếu ID, có thể cần lấy từ Token (Decode JWT) sau này
            username: "", // Thiếu username
            fullName: response.role, // Tạm dùng Role làm tên
            email: "",
            role: roleEnum 
          },
        });

        // 4. Điều hướng
        if (response.role === "Admin") {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error('Không tìm thấy Token trong phản hồi');
      }
    },
    onError: (error: any) => {
      console.error(error);
      message.error('Đăng nhập thất bại: ' + (error.message || 'Lỗi server'));
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
      backgroundColor: '#f0f2f5' 
    }}>
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