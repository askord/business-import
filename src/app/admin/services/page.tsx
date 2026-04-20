"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({ id: null, title: '', description: '', steps: '[]', price: '' });
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken') !== 'true') {
      router.push('/admin/login');
    } else {
      fetchServices();
    }
  }, []);

  const fetchServices = async () => {
    const res = await axios.get('/api/services');
    setServices(res.data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate JSON steps
      JSON.parse(form.steps);

      if (form.id) {
        await axios.put(`/api/services/${form.id}`, form);
      } else {
        await axios.post('/api/services', form);
      }
      setForm({ id: null, title: '', description: '', steps: '[]', price: '' });
      setShowForm(false);
      fetchServices();
    } catch (err) {
      alert("Invalid Steps JSON format. Should be [\"step 1\", \"step 2\"]");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await axios.delete(`/api/services/${id}`);
      fetchServices();
    }
  };

  const handleEdit = (service: any) => {
    setForm(service);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Services Management</h1>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hover:underline">Back to Dashboard</button>
      </div>

      <button
        onClick={() => { setShowForm(true); setForm({ id: null, title: '', description: '', steps: '[]', price: '' }); }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Add New Service
      </button>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit Service' : 'New Service'}</h2>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <textarea
            placeholder='Steps (JSON Array: ["Step 1", "Step 2"])'
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            className="w-full border p-2 mb-2 rounded font-mono" required
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{svc.title}</h3>
              <p className="text-gray-500 text-sm">{svc.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(svc)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(svc.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
