import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyDentist from './pages/ApplyDentist';
import Notifications from './pages/Notifications';
import UsersList from './pages/admin/UsersList';
import DentistsList from './pages/admin/DentistsList';
import Profile from './pages/dentist/Profile';
import BookAppointment from './pages/BookAppointment';
import { ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import Appointments from './pages/Appointments';

function App() {
  const { loading } = useSelector((state) => state.alerts);

  return (
    <ConfigProvider locale={es_ES}>
      <BrowserRouter>
        {loading && (
          <div className="spinner-parent">
            <div className="spinner-border" role="status"></div>
          </div>
        )}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/apply-dentist" element={<ProtectedRoute><ApplyDentist /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/admin/userslist" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
          <Route path="/admin/dentistslist" element={<ProtectedRoute><DentistsList /></ProtectedRoute>} />
          <Route path="/dentist/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/book-appointment/:dentistId" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
