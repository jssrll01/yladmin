import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Vip() {
  const [apps, setApps] = useState([]);

  const load = async () => {
    // Note: ensure your vip_applications table exists or adjust this to match your schema
    const { data, error } = await supabase.from('vip_applications').select('*').order('created_at', { ascending: false });
    if (data) setApps(data);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    if (confirm(`Mark this application as ${status}?`)) {
      await supabase.from('vip_applications').update({ status }).eq('id', id);
      load();
    }
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <h2>VIP Applications</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>User ID / Email</th><th>Date Applied</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {apps.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No applications found.</td></tr>}
            {apps.map(a => (
              <tr key={a.id}>
                <td>{a.user_id}</td>
                <td>{new Date(a.created_at).toLocaleDateString()}</td>
                <td style={{ fontWeight: 600, color: a.status === 'approved' ? 'var(--good)' : a.status === 'rejected' ? 'var(--bad)' : 'var(--gold)' }}>{a.status.toUpperCase()}</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    {a.status === 'pending' && (
                      <>
                        <button className="btn sm" style={{ color: 'var(--good)' }} onClick={() => updateStatus(a.id, 'approved')}>Approve</button>
                        <button className="btn sm bad" onClick={() => updateStatus(a.id, 'rejected')}>Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
