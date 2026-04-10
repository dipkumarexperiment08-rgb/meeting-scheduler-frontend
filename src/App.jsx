import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/Spinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const NewMeeting = lazy(() => import('./pages/NewMeeting'))
const MeetingDetail = lazy(() => import('./pages/MeetingDetail'))
const EditMeeting = lazy(() => import('./pages/EditMeeting'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner size="lg" text="Loading page..." />}>
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
          <Route path="/meetings/:id/edit" element={
            <ProtectedRoute><EditMeeting /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App