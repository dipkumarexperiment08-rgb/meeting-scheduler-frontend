import { createContext, useContext, useState, useEffect } from 'react'
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
  updateMeeting,
} from '../services/meetingService'
import { useAuth } from './AuthContext'

const MeetingContext = createContext()

export const MeetingProvider = ({ children }) => {
  const { token } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch meetings when token is available
  useEffect(() => {
    if (token) fetchMeetings()
  }, [token])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const res = await getMeetings()
      setMeetings(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch meetings')
    } finally {
      setLoading(false)
    }
  }

  const addMeeting = async (data) => {
    const res = await createMeeting(data)
    setMeetings((prev) => [...prev, res.data])
    return res.data
  }

  const removeMeeting = async (id) => {
    await deleteMeeting(id)
    setMeetings((prev) => prev.filter((m) => m._id !== id))
  }

  const editMeeting = async (id, data) => {
    const res = await updateMeeting(id, data)
    setMeetings((prev) => prev.map((m) => (m._id === id ? res.data : m)))
    return res.data
  }

  return (
    <MeetingContext.Provider
      value={{
        meetings,
        loading,
        error,
        fetchMeetings,
        addMeeting,
        removeMeeting,
        editMeeting,
      }}
    >
      {children}
    </MeetingContext.Provider>
  )
}

export const useMeetings = () => useContext(MeetingContext)