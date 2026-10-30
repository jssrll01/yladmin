import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './pages/Login';
import Layout from './components/Layout';
import Products from './pages/Products';

function RequireAdmin({ children }) {
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { nav('/login'); return; }
      supabase.rpc('is_admin').then(({ data }) => {
        if (!data) nav('/login');
        else setLoading(false);
      });
    });
  }, [nav]);

  return loading ? <div style={{ padding: 40 }}>Loading secure environment...</div> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAdmin><Layout /></RequireAdmin>}>
        <Route path="/" element={<Products />} />
        <Route path="/offers" element={<div style={{padding:24}}>Offers module coming next...</div>} />
        <Route path="/codes" element={<div style={{padding:24}}>Codes module coming next...</div>} />
        <Route path="/vip" element={<div style={{padding:24}}>VIP module coming next...</div>} />
      </Route>
    </Routes>
  );
}
