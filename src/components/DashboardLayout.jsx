import Sidebar from './Sidebar'
import Navbar from './Navbar'

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px', flex: 1 }}>
        <Navbar title={title} />
        <main style={{ paddingTop: '80px', padding: '80px 24px 24px 24px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout