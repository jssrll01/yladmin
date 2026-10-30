import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErr(error.message);
    
    // Verify admin status securely
    const { data: isAdmin } = await supabase.rpc('is_admin');
    if (!isAdmin) {
      await supabase.auth.signOut();
      return setErr('Unauthorized. You are not an admin.');
    }
    nav('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <form className="card stack" style={{ width: 400 }} onSubmit={handleLogin}>
        <h2 style={{ textAlign: 'center', color: 'var(--gold)' }}>YL ADMIN SECURE</h2>
        <div className="input"><input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="input"><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        {err && <p style={{ color: 'var(--bad)', fontSize: 14 }}>{err}</p>}
        <button className="btn gold" style={{ justifyContent: 'center' }}>Sign In</button>
      </form>
    </div>
  );
}
