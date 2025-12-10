# FPTU HCM Multi-campus Facility Booking System

Hệ thống đặt lịch phòng họp, phòng lab, sân thể thao dành cho Sinh viên và Giảng viên tại FPT University (Multi-campus). Hệ thống cung cấp giao diện trực quan để kiểm tra lịch trống, đặt chỗ và quản lý tài nguyên cơ sở vật chất.

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Ant%20Design-blue)

## 🌟 Tổng quan dự án

Dự án nhằm giải quyết vấn đề quản lý và phân bổ tài nguyên phòng ốc tại trường.
* **Người dùng (Sinh viên/Giảng viên):** Dễ dàng tìm kiếm phòng trống, đặt lịch nhanh chóng và xem lịch sử sử dụng.
* **Quản trị viên (Admin):** Kiểm soát tài nguyên, duyệt yêu cầu (Approve/Reject) và xem báo cáo thống kê mức độ sử dụng.

## 🚀 Tính năng chính

### Dành cho Sinh viên & Giảng viên (User)
* **Dashboard:** Xem danh sách phòng theo Campus (Quận 9, Hòa Lạc, Quy Nhơn...).
* **Booking:** Đặt phòng họp, Lab, sân thể thao với giao diện Lịch (Calendar) trực quan.
* **Lịch sử:** Theo dõi trạng thái yêu cầu đặt chỗ (Đang chờ, Đã duyệt, Từ chối).

### Dành cho Admin
* **Quản lý Phòng (CRUD):** Thêm, sửa, xóa thông tin phòng, sức chứa, loại phòng.
* **Phê duyệt:** Xử lý các yêu cầu đặt phòng từ sinh viên/giảng viên.
* **Báo cáo (Report):** Thống kê tần suất sử dụng, tỷ lệ lấp đầy phòng.

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng với các công nghệ hiện đại, tập trung vào hiệu năng và trải nghiệm người dùng:

* **Core:** [React 18](https://react.dev/) (Vite Build Tool).
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing).
* **UI Framework:** [Ant Design 5](https://ant.design/) (Hệ thống Design System doanh nghiệp, ổn định và mạnh mẽ).
* **Routing:** [React Router DOM v6](https://reactrouter.com/).
* **Icons:** @ant-design/icons.

## 📂 Cấu trúc dự án

```text
facility-booking-system/
├── public/              # File tĩnh (Logo, favicon)
├── src/
│   ├── assets/          # Hình ảnh, global styles
│   ├── components/      # Các thành phần tái sử dụng
│   │   ├── layout/      # Navbar, Sidebar, Footer
│   │   └── ui/          # Các UI components nhỏ (nếu custom thêm)
│   ├── pages/           # Các màn hình chính
│   │   ├── admin/       # Khu vực dành riêng cho Admin
│   │   ├── BookingPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── WelcomePage.tsx
│   ├── types/           # Định nghĩa TypeScript Interfaces (User, Room, Booking)
│   ├── App.tsx          # Định tuyến (Routing)
│   └── main.tsx         # Điểm khởi chạy & Cấu hình Theme Antd
├── package.json
├── vite.config.ts
└── README.md