import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import DashboardLayout from '../components/DashboardLayout'
import { useMeetings } from '../context/MeetingContext'
import { getMeeting } from '../services/meetingService'
import dayjs from 'dayjs'
import { MdAdd, MdClose, MdAccessTime, MdPeople, MdNotes } from 'react-icons/md'

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  description: z.string().optional(),
  location: z.string().optional(),
})

const COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899',
]

const EditMeeting = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editMeeting } = useMeetings()
  const [guests, setGuests] = useState([])
  const [guestInput, setGuestInput] = useState('')
  const [guestError, setGuestError] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await getMeeting(id)
        const meeting = res.data
        reset({
          title: meeting.title,
          date: dayjs(meeting.date).format('YYYY-MM-DD'),
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          description: meeting.description || '',
          location: meeting.location || '',
        })
        setSelectedColor(meeting.color || COLORS[0])
        setGuests(meeting.guests.map((g) => g.email))
      } catch (err) {
        navigate('/dashboard')
      } finally {
        setFetching(false)
      }
    }
    fetchMeeting()
  }, [id])

  const addGuest = () => {
    const email = guestInput.trim()
    if (!email) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setGuestError('Please enter a valid email')
      return
    }
    if (guests.includes(email)) {
      setGuestError('Guest already added')
      return
    }
    setGuests([...guests, email])
    setGuestInput('')
    setGuestError('')
  }

  const removeGuest = (email) => {
    setGuests(guests.filter((g) => g !== email))
  }

  const onSubmit = async (data) => {
    if (data.startTime >= data.endTime) {
      alert('End time must be after start time')
      return
    }
    try {
      setLoading(true)
      await editMeeting(id, {
        ...data,
        color: selectedColor,
        guests: guests.map((email) => ({ email })),
      })
      navigate(`/meetings/${id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update meeting')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <DashboardLayout title="Edit Meeting">
        <div className="text-center text-gray-400 py-12">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Edit Meeting">
      <div style={{ maxWidth: '680px' }}>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Edit Meeting</h2>
          <p className="text-sm text-gray-400 mt-1">Update your meeting details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">

            {/* Color picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Color</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      backgroundColor: color,
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: selectedColor === color ? '3px solid #1f2937' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title *</label>
              <input
                {...register('title')}
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                {...register('date')}
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1"><MdAccessTime size={14} /> Start Time *</span>
                </label>
                <input
                  {...register('startTime')}
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1"><MdAccessTime size={14} /> End Time *</span>
                </label>
                <input
                  {...register('endTime')}
                  type="time"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                {...register('location')}
                type="text"
                placeholder="e.g. Conference Room / Google Meet link"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1"><MdNotes size={14} /> Description</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="What is this meeting about?"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1"><MdPeople size={14} /> Invite Guests</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGuest())}
                  placeholder="guest@example.com"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addGuest}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
                >
                  <MdAdd size={18} /> Add
                </button>
              </div>
              {guestError && <p className="text-red-500 text-xs mt-1">{guestError}</p>}
              {guests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {guests.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeGuest(email)}
                        className="hover:text-red-500 transition"
                      >
                        <MdClose size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/meetings/${id}`)}
              className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </DashboardLayout>
  )
}

export default EditMeeting