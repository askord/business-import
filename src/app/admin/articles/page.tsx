"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [form, setForm] = useState({ id: null, title: '', slug: '', preview: '', content: '', image: '' });
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken') !== 'true') {
      router.push('/admin/login');
    } else {
      fetchArticles();
    }
  }, []);

  const fetchArticles = async () => {
    const res = await axios.get('/api/articles');
    setArticles(res.data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await axios.put(`/api/articles/${form.id}`, form);
    } else {
      await axios.post('/api/articles', form);
    }
    setForm({ id: null, title: '', slug: '', preview: '', content: '', image: '' });
    setShowForm(false);
    fetchArticles();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles();
    }
  };

  const handleEdit = (article: any) => {
    setForm(article);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Articles Dashboard</h1>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hover:underline">Back to Dashboard</button>
      </div>
      <button
        onClick={() => { setShowForm(true); setForm({ id: null, title: '', slug: '', preview: '', content: '', image: '' }); }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Add New Article
      </button>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">{form.id ? 'Edit Article' : 'New Article'}</h2>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <textarea
            placeholder="Preview"
            value={form.preview}
            onChange={(e) => setForm({ ...form, preview: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <textarea
            placeholder="Content (HTML)"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border p-2 mb-2 rounded h-40" required
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full border p-2 mb-2 rounded" required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {articles.map((art) => (
          <div key={art.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{art.title}</h3>
              <p className="text-gray-500 text-sm">/{art.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(art)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(art.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
