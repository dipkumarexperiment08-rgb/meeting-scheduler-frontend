import { createContext, useContext, useState, useEffect } from 'react'
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
  updateMeeting,
} from '../services/meetingService'
import { useAuth } from './AuthContext'
import socket from '../services/socket'

const MeetingContext = createContext()

export const MeetingProvider = ({ children }) => {
  const { token } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Connect socket and fetch meetings when token available
  useEffect(() => {
    if (token) {
      fetchMeetings()
      socket.connect()
      socket.on('connect', () => {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser) {
          socket.emit('join', storedUser.id || storedUser._id)
        }
      })
    }
    return () => {
      socket.disconnect()
    }
  }, [token])

  // Listen for real-time events
  useEffect(() => {
    socket.on('meeting:created', (meeting) => {
      setMeetings((prev) => {
        const exists = prev.find((m) => m._id === meeting._id)
        if (exists) return prev
        return [...prev, meeting]
      })
    })

    socket.on('meeting:updated', (updated) => {
      setMeetings((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      )
    })

    socket.on('meeting:deleted', (id) => {
      setMeetings((prev) => prev.filter((m) => m._id !== id))
    })

    return () => {
      socket.off('meeting:created')
      socket.off('meeting:updated')
      socket.off('meeting:deleted')
    }
  }, [])

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
    setMeetings((prev) => {
      const exists = prev.find((m) => m._id === res.data._id)
      if (exists) return prev
      return [...prev, res.data]
    })
    return res.data
  }

  const removeMeeting = async (id) => {
    await deleteMeeting(id)
    setMeetings((prev) => prev.filter((m) => m._id !== id))
  }

  const editMeeting = async (id, data) => {
    const res = await updateMeeting(id, data)
    setMeetings((prev) =>
      prev.map((m) => (m._id === id ? res.data : m))
    )
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