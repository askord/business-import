import React from 'react';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import Image from 'next/image';
import { Metadata } from 'next';
import { Header } from '@/app/components/Header/Header';
import Link from 'next/link';

const DB_PATH = path.resolve(process.cwd(), 'database.sqlite');

async function getDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const db = await getDb();
  const article = await db.get("SELECT title, preview FROM articles WHERE slug = ?", [slug]);

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.preview,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const db = await getDb();
  const article = await db.get("SELECT * FROM articles WHERE slug = ?", [slug]);

  if (!article) {
    return (
      <div className="container mx-auto p-20 text-center">
        <h1 className="text-4xl font-bold">Article not found</h1>
        <Link href="/" className="text-blue-600 hover:underline mt-4 block">Return Home</Link>
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
