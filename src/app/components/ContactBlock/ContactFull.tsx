import { ISocialLink, SocialLinks } from '@/app/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const ContactFull = () => {
	return <section id="contacts" className="container mx-auto p-8 py-20 bg-white text-center">
		<h1 className="text-4xl font-bold text-indigo-900 mb-12">Наши контакты</h1>
		{/* <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12">
			<p className="text-xl md:text-2xl text-gray-700 font-bold flex items-center space-x-2">
				<PhoneIcon className="h-6 w-6 text-blue-500" />
				<span>Телефон: <a href="tel:+71234567890" className="text-blue-500 hover:underline">+7 (123) 456-78-90</a></span>
			</p>
			<p className="text-xl md:text-2xl text-gray-700 font-bold flex items-center space-x-2">
				<EnvelopeIcon className="h-6 w-6 text-blue-500" />
				<span>Почта: <a href="mailto:info@business-import.ru" className="text-blue-500 hover:underline">info@business-import.ru</a></span>
			</p>
		</div>
		<div className="flex justify-center space-x-6 mt-8">
			<a href="#" className="text-blue-500 hover:text-indigo-600 transition-colors" aria-label="Telegram">
				<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.15 15.3l-1.37-4.14-4.14-1.37-2.61-2.61a.95.95 0 0 1-.2-.55.95.95 0 0 1 .2-.55l1.62-1.62a.95.95 0 0 1 .55-.2.95.95 0 0 1 .55.2l5.7 5.7c.39.39.39 1.02 0 1.41l-2.03 2.03c-.39.39-1.02.39-1.41 0z"/></svg>
			</a>
			<a href="#" className="text-blue-500 hover:text-indigo-600 transition-colors" aria-label="ВКонтакте">
				<svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.25 14.5c.2 0 .4-.04.6-.14.2-.1.4-.2.55-.35.15-.15.3-.3.4-.5.1-.2.15-.4.15-.65V12c0-.25-.05-.45-.15-.65-.1-.2-.25-.35-.4-.5-.15-.15-.35-.25-.55-.35-.2-.1-.4-.15-.6-.15H12v-2.5h2.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1h-2.5c-.55 0-1-.45-1-1v-.5h-.5c-.55 0-1-.45-1-1v-.5h-.5c-.55 0-1-.45-1-1v-.5h-.5c-.55 0-1-.45-1-1v-.5h-.5c-.55 0-1-.45-1-1v-.5c0-.55.45-1 1-1h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5h.5c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1h-1.5c-1.1 0-2.1-.4-2.8-1.1-.7-.7-1.1-1.7-1.1-2.8v-.5c0-1.1.4-2.1 1.1-2.8.7-.7 1.7-1.1 2.8-1.1h2.5c.55 0 1 .45 1 1v2.5c0 .55-.45 1-1 1h-2.5c-.55 0-1-.45-1-1V12h-2.5v2.5h-1.5v-2.5h-1.5v-2.5c0-.55-.45-1-1-1h-2.5c-.55 0-1-.45-1-1v-2.5c0-.55.45-1 1-1h2.5c.55 0 1 .45 1 1v2.5c0 .55.45 1 1 1h2.5c.55 0 1 .45 1 1v2.5c0 .55-.45 1-1 1h-2.5c-.55 0-1-.45-1-1v-2.5c0-.55.45-1 1-1h2.5c.55 0 1 .45 1 1v2.5c0 .55-.45 1-1 1z"/></svg>
			</a>
		</div> */}


		<div className='flex flex-col md:grid md:gap-5 md:grid-cols-2 place-content-center'>
			{SocialLinks.map((item:ISocialLink,index:number)=><Link target="_blank" key={index} href={item.link} className='flex items-center justify-center gap-5'>
				<Image
					src={item.icon}
					alt={item.name}
					width={50}
					height={50}
				/>
				<span className='text-blue-600 md:text-3xl font-bold'>{item.short}</span>
			</Link>)}
		</div>
	</section>
}
