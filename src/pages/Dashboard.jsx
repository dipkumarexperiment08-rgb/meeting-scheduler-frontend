import DashboardLayout from '../components/DashboardLayout'
import { MdCalendarToday, MdPeople, MdAccessTime, MdCheckCircle, MdDelete } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import { useMeetings } from '../context/MeetingContext'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)

const Dashboard = () => {
  const { user } = useAuth()
  const { meetings, loading, removeMeeting } = useMeetings()
  const navigate = useNavigate()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const upcoming = meetings.filter((m) => m.status === 'upcoming')
  const completed = meetings.filter((m) => m.status === 'completed')
  const totalGuests = meetings.reduce((acc, m) => acc + m.guests.length, 0)
  const thisWeek = meetings.filter((m) =>
    dayjs(m.date).week() === dayjs().week() &&
    dayjs(m.date).year() === dayjs().year()
  )

  const stats = [
    {
      label: 'Total Meetings',
      value: meetings.length,
      icon: <MdCalendarToday size={22} />,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'This Week',
      value: thisWeek.length,
      icon: <MdAccessTime size={22} />,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Participants',
      value: totalGuests,
      icon: <MdPeople size={22} />,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Completed',
      value: completed.length,
      icon: <MdCheckCircle size={22} />,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  return (
    <DashboardLayout title="Dashboard">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {user?.name || 'there'}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening with your meetings today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming meetings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Upcoming Meetings</h3>
          <button
            onClick={() => navigate('/meetings/new')}
            className="text-sm text-blue-600 hover:underline"
          >
            + New Meeting
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Loading meetings...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No upcoming meetings. Create one!
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {upcoming.map((meeting) => (
              <div
                key={meeting._id}
                onClick={() => navigate(`/meetings/${meeting._id}`)}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: meeting.color + '20' }}
                  >
                    <MdCalendarToday size={16} style={{ color: meeting.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayjs(meeting.date).format('MMM D, YYYY')} · {meeting.startTime} - {meeting.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {meeting.guests.length} guests
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: meeting.color + '20',
                      color: meeting.color,
                    }}
                  >
                    upcoming
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeMeeting(meeting._id)
                    }}
                    className="p-1 hover:text-red-500 text-gray-300 transition"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}

export default Dashboard