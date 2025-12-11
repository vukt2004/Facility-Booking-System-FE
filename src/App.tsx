import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import BookingPage from './pages/BookingPage';
import AdminLayout from './components/layout/AdminLayout';
import BookingManager from './pages/admin/BookingManager';
import Dashboard from './pages/admin/Dashboard';
import RoomManager from './pages/admin/RoomManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Các route khác sẽ thêm sau */}
        <Route path="/booking" element={<BookingPage />} />

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<RoomManager />} />
          <Route path="bookings" element={<BookingManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;