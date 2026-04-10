import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      background: '#f9fafb',
    }}>
      <div style={{ fontSize: '80px' }}>📅</div>
      <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#1f2937', margin: 0 }}>404</h1>
      <p style={{ fontSize: '18px', color: '#6b7280' }}>Page not found</p>
      <p style={{ fontSize: '14px', color: '#9ca3af' }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        Go to Dashboard
      </button>
    </div>
  )
}

export default NotFound