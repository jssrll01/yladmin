import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function Codes() {
  const [codes, setCodes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: '', points: '', is_active: true });

  const load = async () => {
    const { data } = await supabase.from('redeem_codes').select('*').order('created_at', { ascending: false });
    if (data) setCodes(data);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await supabase.from('redeem_codes').insert([{ code: form.code.toUpperCase(), points: form.points, is_active: form.is_active }]);
    setModal(false); load();
  };

  const remove = async (id) => {
    if (confirm('Delete this code? Users will no longer be able to claim it.')) {
      await supabase.from('redeem_codes').delete().eq('id', id);
      load();
    }
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="row between">
        <h2>Manage Redeem Codes</h2>
        <button className="btn gold" onClick={() => { setForm({ code: '', points: '', is_active: true }); setModal(true); }}><Plus size={18} /> Generate Code</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Code</th><th>Value (Points)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, letterSpacing: 1 }}>{c.code}</td>
                <td>{c.points} pts</td>
                <td style={{ color: c.is_active ? 'var(--good)' : 'var(--bad)' }}>{c.is_active ? 'Active' : 'Disabled'}</td>
                <td><button className="btn sm bad" onClick={() => remove(c.id)}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-overlay">
          <form className="card stack" style={{ width: 400 }} onSubmit={save}>
            <h3>Create New Code</h3>
            <div className="input"><input placeholder="Code (e.g. SUMMER50)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required /></div>
            <div className="input"><input type="number" placeholder="Points Value" value={form.points} onChange={e => setForm({...form, points: e.target.value})} required /></div>
            <label className="row"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
            <div className="row between" style={{ marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn gold">Create Code</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
