"use client"
import { useSmoothScroll } from '@/app/hooks/useSmoothScroll'
import { ArrowLeftIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid'
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
	const [fullscreenArticle, setFullscreenArticle] = useState<IArticle | undefined>();
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const visibleArticles = articles.slice(currentIndex, currentIndex + 3);
	const scroller = useSmoothScroll()

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

	useEffect(() => {
    if (fullscreenArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullscreenArticle]);

	return <>
		<section id="articles" className="py-20 flex items-center bg-gray-100">
			<div className="container mx-auto px-8">
				<h1 className="text-4xl font-bold text-center text-indigo-900 mb-12">Полезные статьи</h1>
				<div className="relative">
					<div className="grid md:grid-cols-3 gap-8">
						{visibleArticles.map((article) => (
							<div
								key={`${article.id}-mini`}
								onClick={() => setFullscreenArticle(article)}
								className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
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
							</div>
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
		{articles.map((item:IArticle)=><>
			<ArticleFullScreenView key={item.id} show={item.id == fullscreenArticle?.id} article={item} close={() => setFullscreenArticle(undefined)}/>
		</>)}
	</>
}

interface IArticleFullScreenView {
	show: boolean
	article:IArticle
	close:()=>void
}

const ArticleFullScreenView = ({show,article,close}:IArticleFullScreenView) =>
<div className={`${show?"block":"hidden"} fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 md:p-8 z-50`}>
	<div className="bg-white rounded-lg shadow-xl md:max-w-7/12 w-full max-h-full overflow-y-auto relative">
		<Link
			href={`/articles/${article.slug}`}
			className="absolute top-4 right-16 text-indigo-600 hover:text-indigo-900 z-50 p-2 bg-white rounded-xl font-bold"
		>
			Перейти к статье (SEO)
		</Link>
		<button
			onClick={close}
			className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-50 p-1 m-1 bg-white rounded-xl"
			aria-label="Закрыть"
		>
			<XMarkIcon className="h-8 w-8" />
		</button>
		<div className="relative w-full h-64 md:h-96">
			<Image
				src={article.image}
				alt={article.title}
				fill
				className="object-cover"
			/>
		</div>
		<div className="p-6 md:p-8">
			<h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4">{article.title}</h1>
			<div className="prose max-w-none text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
		</div>
	</div>
</div>
