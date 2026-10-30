import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase.js';
import { KeyRound } from 'lucide-react';

export default function Login() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // The dedicated backend account for PIN/NFC logins
  const NFC_EMAIL = 'nfc@yuelin.local';

  const attemptLogin = async (pinCode) => {
    setLoading(true);
    setError('');
    
    try {
      // Authenticate with Supabase so your database RLS policies allow CRUD operations
      const { error } = await supabase.auth.signInWithPassword({
        email: NFC_EMAIL,
        password: pinCode,
      });

      if (error) throw error;

      // Wipe the PIN from the browser's URL bar instantly for security
      window.history.replaceState(null, '', window.location.pathname);

      // RequireAdmin in App.jsx will automatically route to "/"
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      console.error('[yladmin] PIN Auth Error:', err);
      setError('Invalid PIN code');
      setLoading(false);
    }
  };

  // Auto-login if accessed via NFC card URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#pin=')) {
      const urlPin = hash.replace('#pin=', '');
      attemptLogin(urlPin);
    }
  }, []);

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
          <div style={{ color: '#b00020', fontSize: 14, textAlign: 'center', background: '#ffebeb', padding: '8px', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <input
          type="password"
          className="input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••••••••••"
          style={{ 
            textAlign: 'center', 
            letterSpacing: 4, 
            fontSize: 20,
            padding: 16,
            border: 'none',
            borderRadius: 12,
            background: 'var(--bg)',
            boxShadow: 'inset 4px 4px 8px rgb(163,177,198,0.6), inset -4px -4px 8px rgba(255,255,255, 0.5)',
            color: '#444',
            outline: 'none'
          }}
          autoFocus
        />

        <button 
          type="submit" 
          disabled={loading || !pin} 
          style={{ 
            padding: 16,
            border: 'none',
            borderRadius: 12,
            background: 'var(--bg)',
            boxShadow: '6px 6px 10px 0 rgba(163,177,198, 0.5), -6px -6px 10px 0 rgba(255,255,255, 0.5)',
            color: '#6b7385',
            fontWeight: 600,
            fontSize: 16,
            cursor: loading || !pin ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {loading ? 'Verifying...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
