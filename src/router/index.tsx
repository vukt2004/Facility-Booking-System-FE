// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/pages/Auth/Login";
import AdminLayout from "@/components/layout/AdminLayout";
import CampusPage from "@/pages/Admin/CampusPage";
import Register from "@/pages/Auth/Register";
import AreaPage from "@/pages/Admin/AreaPage";
import RoomTypePage from "@/pages/Admin/RoomTypePage";
import RoomPage from "@/pages/Admin/RoomPage";
import RoomSlotPage from "@/pages/Admin/RoomSlotPage";
// Import các trang khác sau khi tạo...

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register", // Thêm route này
    element: <Register />,
  },
  {
    path: "/admin",
    element: <AdminLayout />, // Layout bọc ngoài
    children: [
        {
            // Redirect mặc định vào dashboard hoặc campus
            index: true, 
            element: <Navigate to="/admin/dashboard" replace /> 
        },
        { 
            path: "dashboard", 
            element: <div>Dashboard Content (Coming soon)</div> 
        },
        { 
            path: "campus", 
            element: <CampusPage /> 
        },
        { 
            path: "room-type", 
            element: <RoomTypePage /> 
        },
        { 
            path: "area", 
            element: <AreaPage /> 
        },
        { 
            path: "room", 
            element: <RoomPage /> 
        },
        { 
            path: "slots", 
            element: <RoomSlotPage /> 
        },
    ]
  },
  // Nếu vào đường dẫn lạ thì redirect về login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  }
]);