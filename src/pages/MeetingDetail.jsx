import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { getMeeting } from '../services/meetingService'
import { useMeetings } from '../context/MeetingContext'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPeople,
  MdNotes,
  MdEdit,
  MdDelete,
  MdArrowBack,
} from 'react-icons/md'

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-600',
  accepted: 'bg-green-50 text-green-600',
  declined: 'bg-red-50 text-red-600',
}

const MeetingDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { removeMeeting } = useMeetings()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await getMeeting(id)
        setMeeting(res.data)
      } catch (err) {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchMeeting()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      await removeMeeting(id)
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Meeting Details">
        <div className="text-center text-gray-400 py-12">Loading...</div>
      </DashboardLayout>
    )
  }

  if (!meeting) return null

  const isOrganizer = meeting.organizer?._id === user?.id

  return (
    <DashboardLayout title="Meeting Details">
      <div style={{ maxWidth: '680px' }}>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
        >
          <MdArrowBack size={18} /> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: meeting.color + '20' }}
              >
                <MdCalendarToday size={24} style={{ color: meeting.color }} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{meeting.title}</h1>
                <span
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: meeting.color + '20', color: meeting.color }}
                >
                  {meeting.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            {isOrganizer && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/meetings/${id}/edit`)}
                  className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
                >
                  <MdEdit size={16} /> Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-sm bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg transition"
                >
                  <MdDelete size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4 space-y-4">

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MdCalendarToday size={18} className="text-gray-400 shrink-0" />
            <span>{dayjs(meeting.date).format('dddd, MMMM D, YYYY')}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MdAccessTime size={18} className="text-gray-400 shrink-0" />
            <span>{meeting.startTime} — {meeting.endTime}</span>
          </div>

          {meeting.location && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MdLocationOn size={18} className="text-gray-400 shrink-0" />
              <span>{meeting.location}</span>
            </div>
          )}

          {meeting.description && (
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MdNotes size={18} className="text-gray-400 shrink-0 mt-0.5" />
              <span>{meeting.description}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <MdPeople size={18} className="text-gray-400 shrink-0" />
            <span>Organized by <strong>{meeting.organizer?.name}</strong></span>
          </div>

        </div>

        {/* Guests */}
        {meeting.guests.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Guests ({meeting.guests.length})
            </h3>
            <div className="space-y-3">
              {meeting.guests.map((guest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      {guest.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{guest.email}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[guest.status]}`}>
                    {guest.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default MeetingDetail