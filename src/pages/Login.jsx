import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase.js';
import { KeyRound } from 'lucide-react';

export default function Login() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const hasAttemptedAutoLogin = useRef(false);

  const NFC_EMAIL = 'nfc@yuelin.local';

  const attemptLogin = async (pinCode) => {
    setPin(pinCode); // FIX: Fills the input box immediately so you can see it working
    setLoading(true);
    setError('');
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: NFC_EMAIL,
        password: pinCode,
      });

      if (signInError) throw signInError;

      window.history.replaceState(null, '', window.location.pathname);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      console.error('[yladmin] PIN Auth Error:', err);
      // FIX: Prints the EXACT Supabase error instead of hiding it
      setError(err.message || 'Invalid PIN code');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAttemptedAutoLogin.current) return;
    hasAttemptedAutoLogin.current = true;
    
    const hash = window.location.hash;
    if (hash.startsWith('#pin=')) {
      const urlPin = hash.replace('#pin=', '');
      attemptLogin(urlPin);
    }
  }, [location.hash]);

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptLogin(pin);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)' }}>
      <form className="card" onSubmit={handleSubmit} style={{ width: 320, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: 'var(--bg)', borderRadius: 20, boxShadow: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--bg)', boxShadow: 'inset 6px 6px 10px 0 rgba(163,177,198, 0.5), inset -6px -6px 10px 0 rgba(255,255,255, 0.5)' }}>
            <KeyRound size={28} color="#6b7385" />
          </div>
          <h2 style={{ margin: 0, color: '#444', fontSize: 20 }}>Admin Access</h2>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#888' }}>Tap NFC card or enter PIN</p>
        </div>
        
        {error && (
          <div style={{ color: '#b00020', fontSize: 14, textAlign: 'center', background: '#ffebeb', padding: '12px', borderRadius: 8 }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <input
          type="password"
          className="input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••••••••••"
          style={{ textAlign: 'center', letterSpacing: 4, fontSize: 20, padding: 16, border: 'none', borderRadius: 12, background: 'var(--bg)', boxShadow: 'inset 4px 4px 8px rgb(163,177,198,0.6), inset -4px -4px 8px rgba(255,255,255, 0.5)', color: '#444', outline: 'none' }}
          autoFocus
        />
        <button type="submit" disabled={loading || !pin} style={{ padding: 16, border: 'none', borderRadius: 12, background: 'var(--bg)', boxShadow: '6px 6px 10px 0 rgba(163,177,198, 0.5), -6px -6px 10px 0 rgba(255,255,255, 0.5)', color: '#6b7385', fontWeight: 600, fontSize: 16, cursor: loading || !pin ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}>
          {loading ? 'Verifying...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
