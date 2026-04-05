import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MdDashboard,
  MdCalendarToday,
  MdAddCircleOutline,
  MdPeople,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const links = [
  { to: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
  { to: "/calendar", icon: <MdCalendarToday size={20} />, label: "Calendar" },
  {
    to: "/meetings/new",
    icon: <MdAddCircleOutline size={20} />,
    label: "New Meeting",
  },
  { to: "/contacts", icon: <MdPeople size={20} />, label: "Contacts" },
  { to: "/settings", icon: <MdSettings size={20} />, label: "Settings" },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "256px",
        height: "100vh",
        background: "white",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
        <h1
          style={{
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "18px",
            margin: 0,
          }}
        >
          📅 MeetScheduler
        </h1>
      </div>

      {/* User info */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#dbeafe",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 500,
                color: "#1f2937",
              }}
            >
              {user?.name || "User"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#9ca3af",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: "4px",
              background: isActive ? "#eff6ff" : "transparent",
              color: isActive ? "#2563eb" : "#4b5563",
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#ef4444",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
