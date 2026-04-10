const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', gap: '12px' }}>
      <div
        style={{
          width: sizes[size] === 'w-4 h-4' ? '16px' : sizes[size] === 'w-8 h-8' ? '32px' : '48px',
          height: sizes[size] === 'w-4 h-4' ? '16px' : sizes[size] === 'w-8 h-8' ? '32px' : '48px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <p style={{ fontSize: '14px', color: '#9ca3af' }}>{text}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default Spinner