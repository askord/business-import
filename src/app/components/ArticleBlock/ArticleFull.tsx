"use client"
import { useSmoothScroll } from '@/app/hooks/useSmoothScroll'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface IArticle{
	id: number
	title: string
	slug: string
	preview: string
	content: string
	image: string
}

export const ArticleFull = () => {
	const [articles, setArticles] = useState<IArticle[]>([])
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const visibleArticles = articles.slice(currentIndex, currentIndex + 3);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await axios.get('/api/articles');
      setArticles(res.data);
    };
    fetchArticles();
  }, []);

  const handleNext = () => {
    if (currentIndex + 3 < articles.length) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

	return (
		<section id="articles" className="py-20 flex items-center bg-gray-100">
			<div className="container mx-auto px-8">
				<h1 className="text-4xl font-bold text-center text-indigo-900 mb-12">Полезные статьи</h1>
				<div className="relative">
					<div className="grid md:grid-cols-3 gap-8">
						{visibleArticles.map((article) => (
							<Link
								key={`${article.id}-mini`}
								href={`/articles/${article.slug}`}
								className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden block"
							>
								<div className="relative w-full h-48">
									<Image
										src={article.image}
										alt={article.title}
										fill
										className="object-cover"
									/>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-indigo-900 mb-2">{article.title}</h3>
									<p className="text-gray-600">{article.preview}</p>
								</div>
							</Link>
						))}
					</div>

					{currentIndex > 0 && (
						<button
							onClick={handlePrev}
							className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
							aria-label="Предыдущие статьи"
						>
							<ArrowLeftIcon className="h-6 w-6 text-indigo-900" />
						</button>
					)}

					{currentIndex + 3 < articles.length && (
						<button
							onClick={handleNext}
							className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
							aria-label="Следующие статьи"
						>
							<ArrowRightIcon className="h-6 w-6 text-indigo-900" />
						</button>
					)}
				</div>
			</div>
		</section>
	);
}
