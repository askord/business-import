import Image from 'next/image'
import React from 'react'

export const AboutFull = () => {
	return <section id="about" className="relative py-20 bg-white min-h-screen flex items-center">
		<div className="absolute inset-0 md:m-20">
			<Image
				src="/assets/about/about-1.webp"
				alt="Офис компании"
				layout="fill"
				objectFit="cover"
				// className="opacity-20" // Делаем изображение полупрозрачным
			/>
			{/* Градиентный оверлей для лучшей читаемости текста */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[0%] md:to-[50%] to-gray-900 "></div>
		</div>
		<div className="relative container mx-auto p-8 text-white z-10">
			<h1 className="text-4xl font-bold text-center mb-12">О нас</h1>
			<div className="flex flex-col md:items-end">
				<div className="text-lg space-y-6 md:max-w-1/2 py-5 px-10 text-center md:text-justify">
					<p>
						<span className='md:pl-10'>Мы</span> — ваш надёжный проводник в мире международного бизнеса. Уже более <strong>6 лет</strong> мы успешно помогаем компаниям импортировать товары, обеспечивая прозрачность и безопасность на каждом этапе.
					</p>
					<p>
							<span className='md:pl-10'>Ежегодно</span> мы обрабатываем <strong>более 1200 заявок</strong>, что свидетельствует о высоком доверии наших клиентов и профессионализме нашей команды. Мы ценим долгосрочные отношения и стремимся быть не просто поставщиком услуг, а стратегическим партнёром для вашего роста.
					</p>
				</div>
				<div className="space-y-4 text-lg bg-white/10 p-8 rounded-lg shadow-md backdrop-blur-md md:max-w-1/2 px-5">
					<p className="text-xl font-bold text-blue-300 mb-4">Наши преимущества:</p>
					<ul className="list-disc list-inside space-y-4">
						<li className="flex items-start"><span className="font-bold text-blue-500 mr-2">✓</span> <span className="flex-1"><strong>Экономия времени:</strong> Мы берём на себя всю логистику и документацию.</span></li>
						<li className="flex items-start"><span className="font-bold text-blue-500 mr-2">✓</span> <span className="flex-1"><strong>Выгодные цены:</strong> Благодаря проверенным партнёрам по всему миру.</span></li>
						<li className="flex items-start"><span className="font-bold text-blue-500 mr-2">✓</span> <span className="flex-1"><strong>Прозрачность:</strong> Вы всегда знаете, на каком этапе находится ваш груз.</span></li>
						<li className="flex items-start"><span className="font-bold text-blue-500 mr-2">✓</span> <span className="flex-1"><strong>Надёжность:</strong> Страхование грузов и гарантии сохранности.</span></li>
					</ul>
				</div>
			</div>
		</div>
	</section>
}
