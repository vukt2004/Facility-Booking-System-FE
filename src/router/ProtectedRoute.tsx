import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Result, Button } from 'antd';

interface ProtectedRouteProps {
  allowedRoles?: number[]; // Danh sách các role được phép truy cập
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. Kiểm tra đăng nhập
  if (!isAuthenticated || !user) {
    // Nếu chưa đăng nhập -> Đá về trang Login
    return <Navigate to="/login" replace />;
  }

  // 2. Kiểm tra quyền (Role)
  // Nếu route có yêu cầu role cụ thể mà user không có -> Báo lỗi 403
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Result
          status="403"
          title="403"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
          extra={<Button type="primary" href="/">Về trang chủ</Button>}
        />
      </div>
    );
  }

  // 3. Nếu thỏa mãn tất cả -> Cho phép hiển thị nội dung bên trong (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;