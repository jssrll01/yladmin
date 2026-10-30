import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './pages/Login';
import Layout from './components/Layout';
import Products from './pages/Products';
import Offers from './pages/Offers';
import Codes from './pages/Codes';
import Vip from './pages/Vip';

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
        <Route path="/offers" element={<Offers />} />
        <Route path="/codes" element={<Codes />} />
        <Route path="/vip" element={<Vip />} />
      </Route>
    </Routes>
  );
}
