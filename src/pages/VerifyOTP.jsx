import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const schema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const VerifyOTP = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { userId, email } = location.state || {}
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      setError('')
      const res = await api.post('/auth/verify-otp', {
        userId,
        otp: data.otp,
      })
      login({ email, name: email.split('@')[0] }, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We sent a 6-digit OTP to <span className="font-medium text-gray-700">{email}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              {...register('otp')}
              type="text"
              maxLength={6}
              placeholder="123456"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg"
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/register" className="text-blue-600 hover:underline">
            Back to Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default VerifyOTP