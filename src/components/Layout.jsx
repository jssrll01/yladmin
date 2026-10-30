import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, QrCode, Crown, LogOut, Settings } from 'lucide-react';
import { supabase } from '../supabase';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/offers', icon: Tag, label: 'Offers' },
    { path: '/codes', icon: QrCode, label: 'Redeem Codes' },
    { path: '/vip', icon: Crown, label: 'VIP Apps' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="layout-container">
      <nav className="sidebar">
        <div style={{ marginBottom: 32, padding: '0 16px' }}>
          <h1 style={{ margin: 0, color: 'var(--text-dark)', fontSize: 24 }}>YUELIN</h1>
          <span style={{ fontSize: 12, color: 'var(--primary)' }}>ADMIN PORTAL</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <button onClick={handleLogout} className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 'auto' }}>
          <LogOut size={20} />
          Sign Out
        </button>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
