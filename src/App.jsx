import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { supabase } from './supabase.js';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Products from './pages/Products.jsx';
import Offers from './pages/Offers.jsx';
import Codes from './pages/Codes.jsx';
import Vip from './pages/Vip.jsx';

function Screen({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, color: '#6b7385', fontFamily: 'system-ui' }}>
      {children}
    </div>
  );
}

// Never returns null forever: every path ends in a screen, a redirect or the app.
function RequireAdmin() {
  const loc = useLocation();
  const [state, setState] = useState('checking'); // checking | ok | out | error

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
  if (state === 'error') {
    return (
      <Screen>
        <div style={{ textAlign: 'center' }}>
          <p>Could not reach the server.</p>
          <button type="button" onClick={() => window.location.reload()}>Try again</button>
        </div>
      </Screen>
    );
  }
  if (state === 'out') return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <Layout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAdmin />}>
        <Route path="/" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/codes" element={<Codes />} />
        <Route path="/vip" element={<Vip />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
