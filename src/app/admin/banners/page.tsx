"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface IBanner {
  id: number;
  image_url: string;
  title?: string;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [form, setForm] = useState({ image_url: '', title: '' });
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken') !== 'true') {
      router.push('/admin/login');
    } else {
      fetchBanners();
    }
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get('/api/banners');
      setBanners(res.data);
    } catch (e) {
      console.error('Failed to fetch banners', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/banners', form);
      setForm({ image_url: '', title: '' });
      setShowForm(false);
      fetchBanners();
    } catch (e) {
      alert('Ошибка при сохранении баннера');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это фоновое изображение?')) {
      try {
        await axios.delete(`/api/banners/${id}`);
        fetchBanners();
      } catch (e) {
        alert('Ошибка при удалении баннера');
      }
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">Фоновые изображения (баннеры)</h1>
        <button onClick={() => router.push('/admin')} className="text-blue-600 hover:underline">
          Вернуться в дашборд
        </button>
      </div>

      <button
        onClick={() => {
          setShowForm(true);
          setForm({ image_url: '', title: '' });
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6 transition"
      >
        + Добавить изображение сверху
      </button>

      {showForm && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-md mb-8 border">
          <h2 className="text-xl font-bold mb-4">Новое фоновое изображение</h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL изображения (например, /assets/main/main-1.webp или прямая ссылка)
          </label>
          <input
            placeholder="URL изображения (/assets/... или https://...)"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full border p-2 mb-4 rounded"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название / описание (опционально)
          </label>
          <input
            placeholder="Название или описание баннера"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 mb-4 rounded"
          />

          {form.image_url && (
            <div className="mb-4">
              <span className="block text-sm text-gray-500 mb-1">Предпросмотр:</span>
              <div className="relative w-48 h-28 border rounded overflow-hidden">
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 rounded-xl shadow border flex flex-col justify-between">
            <div>
              <div className="relative w-full h-44 rounded-lg overflow-hidden mb-3 bg-gray-100">
                <Image
                  src={banner.image_url}
                  alt={banner.title || `Баннер ${banner.id}`}
                  layout="fill"
                  objectFit="cover"
                  unoptimized={banner.image_url.startsWith('http://') || banner.image_url.startsWith('https://')}
                />
              </div>
              <h3 className="font-bold text-gray-800">{banner.title || `Баннер #${banner.id}`}</h3>
              <p className="text-gray-500 text-xs break-all mt-1">{banner.image_url}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(banner.id)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm transition"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
