import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/CalendarPage'
import NewMeeting from './pages/NewMeeting'
import MeetingDetail from './pages/MeetingDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute><CalendarPage /></ProtectedRoute>
        } />
        <Route path="/meetings/new" element={
          <ProtectedRoute><NewMeeting /></ProtectedRoute>
        } />
        <Route path="/meetings/:id" element={
          <ProtectedRoute><MeetingDetail /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App