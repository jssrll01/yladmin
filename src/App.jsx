import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './supabase.js';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';

// Placeholders for routes until you copy the full components
const Placeholder = ({ title }) => (
  <div>
    <div className="page-header">
      <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>{title}</h2>
    </div>
    <div className="card" style={{ padding: 32 }}>
      <p>This module is ready to receive the UI from xadmin.</p>
    </div>
  </div>
);

function Screen({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, color: '#6b7385', fontFamily: 'system-ui' }}>
      {children}
    </div>
  );
}

function RequireAdmin() {
  const loc = useLocation();
  const [state, setState] = useState('checking');

  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data.session) { if (alive) setState('out'); return; }
        const r = await supabase.rpc('is_admin');
        if (r.error) throw r.error;
        if (alive) setState(r.data === true ? 'ok' : 'out');
      } catch (e) {
        console.error('[yladmin] access check failed', e);
        if (alive) setState('error');
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((evt) => { if (evt === 'SIGNED_OUT' && alive) setState('out'); });
    const t = setTimeout(() => { if (alive) setState((s) => (s === 'checking' ? 'error' : s)); }, 10000);
    return () => { alive = false; clearTimeout(t); sub.subscription.unsubscribe(); };
  }, []);

  if (state === 'checking') return <Screen>Checking access…</Screen>;
  if (state === 'error') return <Screen><div style={{ textAlign: 'center' }}><p>Could not reach the server.</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div></Screen>;
  if (state === 'out') return <Navigate to={`/login${loc.hash}`} replace state={{ from: loc.pathname }} />;
  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAdmin />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/products" element={<Placeholder title="Products Management" />} />
        <Route path="/offers" element={<Placeholder title="Offers & Promos" />} />
        <Route path="/codes" element={<Placeholder title="Redeem Codes" />} />
        <Route path="/vip" element={<Placeholder title="VIP Applications" />} />
        <Route path="/settings" element={<Placeholder title="System Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
