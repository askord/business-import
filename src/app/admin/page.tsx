"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('adminToken') !== 'true') {
      router.push('/admin/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-indigo-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/admin/articles" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Articles</h2>
            <p className="text-gray-600">Create, edit, and delete SEO-friendly articles for your site.</p>
          </Link>

          <Link href="/admin/services" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Services</h2>
            <p className="text-gray-600">Update service descriptions, steps, and pricing information.</p>
          </Link>

          <Link href="/admin/banners" className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Manage Banners</h2>
            <p className="text-gray-600">Add and manage background images for the top hero banner.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
