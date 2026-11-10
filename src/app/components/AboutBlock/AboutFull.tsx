import Image from 'next/image'
import React from 'react'

export const AboutFull = () => {
	return (
		<section id="about" className="relative pt-28 pb-20 bg-slate-900 min-h-screen flex items-center justify-center">
			<div className="absolute inset-0">
				<Image
					src="/assets/about/about-1.webp"
					alt="Офис компании"
					fill
					className="object-cover opacity-25"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/85 to-slate-950/90" />
			</div>
			<div className="relative container mx-auto px-4 md:px-8 text-white z-10 max-w-4xl flex flex-col items-center">
				<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">
					О нас
				</h1>
				<div className="w-20 h-1 bg-blue-500 rounded-full mb-10 mx-auto" />

				<div className="text-base md:text-lg space-y-6 text-center text-slate-200 leading-relaxed mb-10 max-w-3xl">
					<p>
						Мы — ваш надёжный проводник в мире международного бизнеса. Уже более <strong className="text-white font-semibold">6 лет</strong> мы успешно помогаем компаниям импортировать товары, обеспечивая прозрачность и безопасность на каждом этапе.
					</p>
					<p>
						Ежегодно мы обрабатываем <strong className="text-white font-semibold">более 1200 заявок</strong>, что свидетельствует о высоком доверии наших клиентов и профессионализме нашей команды. Мы ценим долгосрочные отношения и стремимся быть не просто поставщиком услуг, а стратегическим партнёром для вашего роста.
					</p>
				</div>

				<div className="w-full bg-slate-800/60 border border-slate-700/60 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md">
					<h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-6 text-center">
						Наши преимущества
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
						<div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
							<span className="font-bold text-blue-400 mr-3 text-lg">✓</span>
							<span className="text-sm md:text-base text-slate-200">
								<strong className="text-white font-semibold">Экономия времени:</strong> Мы берём на себя всю логистику и документацию.
							</span>
						</div>
						<div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
							<span className="font-bold text-blue-400 mr-3 text-lg">✓</span>
							<span className="text-sm md:text-base text-slate-200">
								<strong className="text-white font-semibold">Выгодные цены:</strong> Благодаря проверенным партнёрам по всему миру.
							</span>
						</div>
						<div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
							<span className="font-bold text-blue-400 mr-3 text-lg">✓</span>
							<span className="text-sm md:text-base text-slate-200">
								<strong className="text-white font-semibold">Прозрачность:</strong> Вы всегда знаете, на каком этапе находится ваш груз.
							</span>
						</div>
						<div className="flex items-start bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
							<span className="font-bold text-blue-400 mr-3 text-lg">✓</span>
							<span className="text-sm md:text-base text-slate-200">
								<strong className="text-white font-semibold">Надёжность:</strong> Страхование грузов и гарантии сохранности.
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
