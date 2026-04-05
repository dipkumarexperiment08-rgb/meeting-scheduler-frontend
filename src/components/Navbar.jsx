import { MdNotifications, MdSearch, MdMenu } from 'react-icons/md'

const Navbar = ({ title, onMenuClick }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-10">

      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition"
        >
          <MdMenu size={22} className="text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <MdSearch size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            className="bg-transparent text-sm outline-none text-gray-600 w-36 lg:w-48"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition">
          <MdNotifications size={22} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

    </div>
  )
}

export default Navbar