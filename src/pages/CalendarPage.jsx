import { useState, useMemo } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import DashboardLayout from '../components/DashboardLayout'
import { useMeetings } from '../context/MeetingContext'
import { useNavigate } from 'react-router-dom'

const localizer = dayjsLocalizer(dayjs)

const CalendarPage = () => {
  const { meetings, loading } = useMeetings()
  const navigate = useNavigate()
  const [view, setView] = useState('month')

  // Convert meetings to calendar events
  const events = useMemo(() => {
    return meetings.map((meeting) => {
      const dateStr = dayjs(meeting.date).format('YYYY-MM-DD')
      const start = new Date(`${dateStr}T${meeting.startTime}`)
      const end = new Date(`${dateStr}T${meeting.endTime}`)
      return {
        id: meeting._id,
        title: meeting.title,
        start,
        end,
        color: meeting.color,
        resource: meeting,
      }
    })
  }, [meetings])

  const handleSelectSlot = ({ start }) => {
    const date = dayjs(start).format('YYYY-MM-DD')
    navigate(`/meetings/new?date=${date}`)
  }

  const handleSelectEvent = (event) => {
    navigate(`/meetings/${event.id}`)
  }

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || '#3b82f6',
      borderRadius: '6px',
      border: 'none',
      color: 'white',
      fontSize: '12px',
      padding: '2px 6px',
    },
  })

  return (
    <DashboardLayout title="Calendar">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">My Calendar</h2>
          <p className="text-sm text-gray-400">Click on a date to create a meeting</p>
        </div>
        <button
          onClick={() => navigate('/meetings/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          + New Meeting
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
          Loading calendar...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 580 }}
            view={view}
            onView={setView}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
          />
        </div>
      )}

    </DashboardLayout>
  )
}

export default CalendarPage