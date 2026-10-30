import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price_points: '', is_active: true });

  const load = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (data) setOffers(data);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('offers').update(form).eq('id', editId);
    } else {
      await supabase.from('offers').insert([form]);
    }
    setModal(false); load();
  };

  const remove = async (id) => {
    if (confirm('Delete this offer?')) {
      await supabase.from('offers').delete().eq('id', id);
      load();
    }
  };

  const openEdit = (o) => { setForm(o); setEditId(o.id); setModal(true); };
  const openNew = () => { setForm({ title: '', description: '', price_points: '', is_active: true }); setEditId(null); setModal(true); };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="row between">
        <h2>Manage Offers</h2>
        <button className="btn gold" onClick={openNew}><Plus size={18} /> New Offer</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Title</th><th>Cost (Points)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.title}</td>
                <td>{o.price_points} pts</td>
                <td>{o.is_active ? 'Active' : 'Hidden'}</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn sm" onClick={() => openEdit(o)}><Edit2 size={14} /></button>
                    <button className="btn sm bad" onClick={() => remove(o.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-overlay">
          <form className="card stack" style={{ width: 400 }} onSubmit={save}>
            <h3>{editId ? 'Edit Offer' : 'New Offer'}</h3>
            <div className="input"><input placeholder="Offer Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
            <div className="input"><input type="number" placeholder="Cost (Points)" value={form.price_points} onChange={e => setForm({...form, price_points: e.target.value})} required /></div>
            <div className="input"><textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <label className="row"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active</label>
            <div className="row between" style={{ marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn gold">Save Offer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
