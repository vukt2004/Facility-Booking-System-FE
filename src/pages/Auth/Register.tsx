import React from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/services/auth.service';
import { type RegisterRequest, UserRole } from '@/types/auth.types';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Mutation gọi API đăng ký
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    },
    onError: (error: any) => {
      // Xử lý lỗi từ BE trả về (thường là message dạng text)
      const errorMsg = error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      message.error(errorMsg);
    },
  });

  const onFinish = (values: any) => {
    // Loại bỏ field 'confirm' không cần gửi lên API
    const { confirm, ...payload } = values;
    registerMutation.mutate(payload as RegisterRequest);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px 0',
      position: 'relative'
    }}>

      {/* --- NÚT QUAY LẠI ĐĂNG NHẬP / TRANG CHỦ --- */}
      <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 10 }}>
          <Button 
            icon={<HomeOutlined />} 
            onClick={() => navigate('/')}
          >
            Trang chủ
          </Button>
      </div>
      {/* ------------------------------------------- */}
      
      <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ color: '#1890ff' }}>Đăng Ký Tài Khoản</Title>
          <Text type="secondary">Tham gia hệ thống đặt phòng F-Booking</Text>
        </div>

        <Form
          form={form}
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={{ role: UserRole.Student }} // Mặc định là Sinh viên
        >
          {/* Hàng 1: Username & Phone */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập SĐT!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'SĐT không hợp lệ' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="090123..." />
              </Form.Item>
            </Col>
          </Row>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Email không hợp lệ!' },
              { required: true, message: 'Vui lòng nhập Email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="student@fpt.edu.vn" />
          </Form.Item>

          {/* Mật khẩu */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          {/* Chọn Role */}
          <Form.Item
            name="role"
            label="Bạn là ai?"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value={UserRole.Student}>Sinh viên (Student)</Option>
              <Option value={UserRole.Lecturer}>Giảng viên (Lecturer)</Option>
              {/* Thường Admin không cho đăng ký public, nhưng nếu cần test bạn có thể mở dòng dưới */}
              {/* <Option value={UserRole.Admin}>Admin</Option> */}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={registerMutation.isPending}
            >
              Đăng Ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;