// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import AdminLayout from "@/components/layout/AdminLayout";
import CampusPage from "@/pages/Admin/CampusPage";
import AreaPage from "@/pages/Admin/AreaPage";
import RoomTypePage from "@/pages/Admin/RoomTypePage";
import RoomPage from "@/pages/Admin/RoomPage";
import RoomSlotPage from "@/pages/Admin/RoomSlotPage";

// User Pages
import BookingPage from "@/pages/User/BookingPage";
import MyBookingPage from "@/pages/User/MyBookingPage";
import LandingPage from "@/pages/General/LandingPage";
import ProtectedRoute from "./ProtectedRoute"; // Import Component bảo vệ
import MainLayout from "@/components/layout/MainLayout"; // Layout có Header cho User
import BookingApprovalPage from "@/pages/Admin/BookingApprovalPage";
import UserPage from "@/pages/Admin/UserPage";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES (Ai cũng vào được) ---
  {
    path: "/",
    element: <LandingPage />, // Trang chủ là Landing Page
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // --- ADMIN ROUTES (Chỉ Admin mới vào được - Role 0) ---
  {
    element: <ProtectedRoute allowedRoles={[0]} />, // Bọc bảo vệ Role = 0
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <div>Dashboard Thống Kê (Coming soon)</div> },
          { path: "campus", element: <CampusPage /> },
          { path: "area", element: <AreaPage /> },
          { path: "room-type", element: <RoomTypePage /> },
          { path: "room", element: <RoomPage /> },
          { path: "slots", element: <RoomSlotPage /> },
          { 
            path: "bookings", 
            element: <BookingApprovalPage />
          },
          { path: "users", element: <UserPage /> },
        ]
      }
    ]
  },

  // --- USER ROUTES (Sinh viên & Giảng viên - Role 2, 1) ---
  {
    element: <ProtectedRoute allowedRoles={[2, 1]} />, // Bọc bảo vệ Role 2 và 1
    children: [
      {
        path: "/", 
        element: <MainLayout />, // Layout chung cho User (có menu Booking, History)
        children: [
          { path: "booking", element: <BookingPage /> },
          { path: "my-bookings", element: <MyBookingPage /> },
        ]
      }
    ]
  },

  // --- FALLBACK ---
  {
    path: "*",
    element: <Navigate to="/" replace />, // Vào link linh tinh thì về Landing Page
  }
]);