import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Package, Tag, Ticket, Users, Crown, LogOut } from 'lucide-react';
import { supabase } from '../supabase';

const navs = [
  { to: '/', label: 'Products', icon: Package },
  { to: '/offers', label: 'Offers', icon: Tag },
  { to: '/codes', label: 'Redeem Codes', icon: Ticket },
  { to: '/vip', label: 'VIP Applications', icon: Crown },
];

export default function Layout() {
  const nav = useNavigate();
  const logout = async () => { await supabase.auth.signOut(); nav('/login'); };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 style={{ color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: 24 }}>YL ADMIN</h2>
        {navs.map((n) => (
          <NavLink key={n.to} to={n.to} className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <n.icon size={20} /> {n.label}
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <button className="nav-item" onClick={logout}><LogOut size={20} /> Sign Out</button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
