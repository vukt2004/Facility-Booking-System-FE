import { useState } from 'react';
import { Button, Form, Input, Card, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../types';
import { UserRole } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Mapping dữ liệu form sang DTO
      const registerData: RegisterRequest = {
        userName: values.username,
        password: values.password,
        email: values.email,
        phoneNumber: values.phoneNumber,
        role: Number(values.role) as UserRole // Chuyển string sang number enum
      };

      const res: any = await authService.register(registerData);

      if (res && (!res.errorCode || res.errorCode === 0)) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        message.error(res.message || 'Đăng ký thất bại!');
      }

    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký!');
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
      background: '#f0f2f5' 
    }}>
      <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Đăng Ký Tài Khoản</Title>
          <Text type="secondary">Tạo tài khoản mới để đặt phòng</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Ví dụ: minhsv" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' },
              { required: true, message: 'Vui lòng nhập Email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="name@fpt.edu.vn" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxx" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Bạn là ai?"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value={UserRole.Student}>Sinh viên</Option>
              <Option value={UserRole.Lecturer}>Giảng viên</Option>
              {/* Thường Admin không cho đăng ký public, nên ta ẩn đi */}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: '#f57224', borderColor: '#f57224' }}>
              Đăng Ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản? <Link to="/login" style={{ color: '#f57224' }}>Đăng nhập ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;