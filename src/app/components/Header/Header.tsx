"use client"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image'
import React, { useState } from 'react'
import Link from 'next/link'

export const Header = () => {

	const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

	return <>
		<header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
			<nav className="container mx-auto px-4 py-2 flex justify-between items-center">
				<div className="text-3xl font-extrabold text-indigo-900">
					<Link href="/">
						<Image
							src="/assets/logo/LogoMiddle.webp"
							alt="Офис компании"
							width={200}
							height={100}
							className="rounded-xl"
						/>
					</Link>
				</div>

				{/* Меню для больших экранов */}
				<div className="space-x-6 hidden md:flex">
					<Link href="/#main" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">Главная</Link>
					<Link href="/#about" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">О нас</Link>
					<Link href="/#articles" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">Полезные статьи</Link>
					<Link href="/#services" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">Услуги</Link>
					<Link href="/#contact-form" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">Связь</Link>
					<Link href="/#contacts" className="text-gray-600 hover:text-blue-500 font-semibold transition-colors">Контакты</Link>
				</div>

				{/* Кнопка-гамбургер для мобильных устройств */}
				<div className="md:hidden">
					<button onClick={toggleMenu} className="text-gray-600 hover:text-blue-500 transition-colors" aria-label="Открыть меню">
						{isMenuOpen ? (
							<XMarkIcon className="h-8 w-8" />
						) : (
							<Bars3Icon className="h-8 w-8" />
						)}
					</button>
				</div>
			</nav>

			{/* Мобильное меню */}
			<div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white shadow-inner pb-4`}>
				<Link href="/#main" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors border-b">Главная</Link>
				<Link href="/#about" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors border-b">О нас</Link>
				<Link href="/#articles" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors border-b">Полезные статьи</Link>
				<Link href="/#services" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors border-b">Услуги</Link>
				<Link href="/#contact-form" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors border-b">Связь</Link>
				<Link href="/#contacts" onClick={toggleMenu} className="block px-4 py-3 text-lg text-gray-700 hover:bg-gray-100 font-semibold transition-colors">Контакты</Link>
			</div>
		</header>
	</>
}
