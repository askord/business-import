"use client"
// pages/index.js
// pages/index.js
import { MainFull } from './components/MainBlock/MainFull';
import { AboutFull } from './components/AboutBlock/AboutFull';
import { ArticleFull } from './components/ArticleBlock/ArticleFull';
import { MainFormFull } from './components/MailFormBlock/MainFormFull';
import { ContactFull } from './components/ContactBlock/ContactFull';
import { ServicesFull } from './components/ServicesBlock/ServicesFull';
import { Header } from './components/Header/Header';

export default function Home() {

  return <div className="font-sans text-gray-800">
		<Header />

		<main className="pt-20">
			{/* Главный блок */}
			<MainFull />

			{/* Блок "О нас" */}
			<AboutFull />

			{/* Блок "Статьи" */}
			<ArticleFull />

			{/* Блок "Услуги" */}
			<ServicesFull />

			{/* Формочка для связи */}
			<MainFormFull />
			{/* Контакты */}
			<ContactFull />
		</main>
		<footer className="bg-indigo-900 text-white text-center p-6">
			&copy; 2025 Бизнес-импорт. Все права защищены.
		</footer>
	</div>

	{/* Блок "Отзывы" */}
	{/* <ReviewFull /> */}
}