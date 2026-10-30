import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

export default function Products() {
  const [prods, setProds] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', in_stock: true, is_active: true });

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProds(data);
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) {
      await supabase.from('products').update(form).eq('id', editId);
    } else {
      await supabase.from('products').insert([form]);
    }
    setModal(false); load();
  };

  const remove = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      load();
    }
  };

  const openEdit = (p) => { setForm(p); setEditId(p.id); setModal(true); };
  const openNew = () => { setForm({ name: '', description: '', price: '', image_url: '', in_stock: true, is_active: true }); setEditId(null); setModal(true); };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="row between">
        <h2>Manage Products</h2>
        <button className="btn gold" onClick={openNew}><Plus size={18} /> New Product</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {prods.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>₱{p.price}</td>
                <td style={{ color: p.in_stock ? 'var(--good)' : 'var(--bad)' }}>{p.in_stock ? 'In Stock' : 'Out of Stock'}</td>
                <td>{p.is_active ? 'Active' : 'Hidden'}</td>
                <td>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn sm" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                    <button className="btn sm bad" onClick={() => remove(p.id)}><Trash2 size={14} /></button>
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
            <h3>{editId ? 'Edit Product' : 'New Product'}</h3>
            <div className="input"><input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="input"><input type="number" placeholder="Price (₱)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
            <div className="input"><textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="input"><input placeholder="Image URL (Optional)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            <label className="row"><input type="checkbox" checked={form.in_stock} onChange={e => setForm({...form, in_stock: e.target.checked})} /> In Stock</label>
            <label className="row"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> Active (Visible)</label>
            <div className="row between" style={{ marginTop: 12 }}>
              <button type="button" className="btn" onClick={() => setModal(false)}>Cancel</button>
              <button type="submit" className="btn gold">Save Product</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
