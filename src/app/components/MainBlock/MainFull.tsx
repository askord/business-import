import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MailFormMini } from '../MailFormBlock/MainFormFull';
import { XMarkIcon } from '@heroicons/react/24/solid';

const DEFAULT_MAIN_IMAGES: string[] = [
	'/assets/main/main-1.webp',
	'/assets/main/main-2.webp',
	'/assets/main/main-3.webp',
	'/assets/main/main-4.webp',
];

export const MainFull = () => {
	const [images, setImages] = useState<string[]>(DEFAULT_MAIN_IMAGES);
	const [currentImage, setCurrentImage] = useState(0);
	const [showContactModal, setShowContactModal] = useState<boolean>(false);

	useEffect(() => {
		const fetchBanners = async () => {
			try {
				const res = await axios.get('/api/banners');
				if (Array.isArray(res.data) && res.data.length > 0) {
					setImages(res.data.map((b: { image_url: string }) => b.image_url));
				}
			} catch (e) {
				// Fallback to default images
			}
		};
		fetchBanners();
	}, []);

	useEffect(() => {
		if (images.length === 0) return;
		const timer = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % images.length);
		}, 5000);

		return () => clearInterval(timer);
	}, [images]);

	useEffect(() => {
		if (showContactModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [showContactModal]);

	return (
		<section id="main" className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen">
			{/* Фоновые изображения карусели */}
			<div className="absolute inset-0 z-0">
				{images.map((image, index) => (
					<div
						key={`${image}-${index}`}
						className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
							index === currentImage ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<Image
							src={image}
							alt={`Фоновое изображение ${index + 1}`}
							layout="fill"
							objectFit="cover"
							quality={80}
							priority={index === 0}
							unoptimized={image.startsWith('http://') || image.startsWith('https://')}
						/>
					</div>
				))}
				{/* Затемняющий оверлей для читаемости текста */}
				<div className="absolute inset-0 bg-black opacity-60"></div>
			</div>

			{/* Контент баннера */}
			<div className="z-10 text-white text-center my-10 px-4 max-w-4xl mx-auto flex flex-col items-center">
				<h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg mb-6">
					Международная торговля<br />
					<span className="font-bold text-blue-500">Инновационно</span> и <span className="font-bold text-blue-500">Профессионально.</span>
				</h1>
				<p className="text-xl md:text-2xl text-gray-200 drop-shadow-md mb-8 max-w-2xl">
					<span className="font-bold">Бизнес-Import</span> — надежный партнёр с многолетним опытом работы в сфере международной торговли. Наша компания — верный выбор для поиска и импорта товаров из любой точки мира.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<button
						onClick={() => setShowContactModal(true)}
						className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg cursor-pointer"
					>
						Связаться с нами
					</button>
					<a
						href="#services"
						className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 text-lg border border-white/40"
					>
						Наши услуги
					</a>
				</div>
			</div>

			{/* Модальное окно связи */}
			{showContactModal && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 md:p-8 z-50">
					<div className="bg-white rounded-lg shadow-xl md:max-w-7/12 w-full max-h-full overflow-y-auto relative">
						<button
							onClick={() => setShowContactModal(false)}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-50 p-2"
							aria-label="Закрыть"
						>
							<XMarkIcon className="h-8 w-8" />
						</button>
						<div className="p-6 md:p-8">
							<MailFormMini close={() => setShowContactModal(false)} />
						</div>
					</div>
				</div>
			)}
		</section>
	);
};
