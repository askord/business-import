import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from '@/app/components/Header/Header';
import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  slug: string;
  preview: string;
  content: string;
  image: string;
  created_at: string;
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const BACKEND_URL = process.env.INTERNAL_BACKEND_URL || 'http://localhost:5000';

async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/articles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('Error fetching article:', e);
    return null;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) return { title: 'Статья не найдена' };

  return {
    title: article.title,
    description: article.preview,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return (
      <div className="font-sans text-gray-800">
        <Header />
        <main className="pt-24 pb-20 bg-gray-100 min-h-screen">
          <div className="container mx-auto p-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
            <p className="text-gray-600 mb-6">Возможно, статья была удалена или ссылка неверна.</p>
            <Link href="/" className="text-blue-600 hover:underline">Вернуться на главную</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800">
      <Header />
      <main className="pt-24 pb-20 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 md:px-20">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-900 mb-8 leading-tight">
                {article.title}
              </h1>
              <div
                className="prose max-w-none text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
              />
              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link href="/#articles" className="text-indigo-600 font-bold hover:underline flex items-center">
                   ← Назад к списку статей
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-indigo-900 text-white text-center p-6">
        &copy; 2025 Бизнес-импорт. Все права защищены.
      </footer>
    </div>
  );
}
