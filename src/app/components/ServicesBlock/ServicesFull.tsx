import { useSmoothScroll } from '@/app/hooks/useSmoothScroll'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IMainFormFull, MailFormMini } from '../MailFormBlock/MainFormFull'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface IService{
	title: string
	description: string
	steps: string[]
	price: string
	blur?: boolean
	find?: boolean
}

const SERVICES:IService[] = [
	{
		title: "Импорт «под ключ».",
		description: "Комплекс услуг по организации импорта товаров.",
		steps: [
			"Минимальный набор*",
			"- Поиск товара",
			"- Переговоры с поставщиками",
			"- Оформление документов",
			"- Передача груза"
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Поиск товара",
		description: "Поможем вам найти интерисующий вас товар.",
		steps: [
			"- Консультация",
			"- Поиск наиболее подходящих поставщиков",
			"- Проверка надёжности поставщиков",
		],
		price: "от 1500 ₽"

	},
	{
		title: "Переговоры с поставщиками",
		description: "Поможем договориться с поставщиками.",
		steps: [
			"- Проведение переговоров на Китайском языке (устно/письменно)",
			"- Получение подробной информации о продукции",
			"- Согласование условий сотрудничества",
		],
		price: "от 2500 ₽"
	},
	{
		title: "Оформление документов",
		description: "Формирование полного пакета документов для осуществления импорта продукции",
		steps: [
			"- Получение и перевод первичных документов (Китайских) от поставщика",
			"- Подготовка и оформление вторичных документов (Российских) необходимых для импорта",
		],
		price: "от 3500 ₽"
	},
	{
		title: "Перевод Английский/Китайский",
		description: "Если у вас возникают трудности в общении с поставщиком",
		steps: [
			"- Устный: перевод на встречах(онлайн/офлайн), ПНР, выставках и т.д.",
			"- Письменный: перевод документации, инструкций, сертификатов и т.д. (в том числе локализация ПО)"
		],
		price: "от 500 ₽"
	},
	{
		title: "Сопровождение в Китае",
		description: "Поможем реализовать выездные командировки в Китай",
		steps: [
			"- Подготовка плана поездки (проживание, питание, встречи, трансфер)",
			"- Подготовка документов для въезда в Китай (визы и прочее)",
			"- Сопровождение переводчиком (переговоры)",
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Контроль производства и качества",
		description: "Удостоверимся в соблюдении условий Вашего с поставщиком договора",
		steps: [
			"- Формирование графика производства",
			"- Фото и видео фиксация готовой продукции",
			"- Выезд независимого эксперта, оценка товара по чек-листу клиента",
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Консолидация товара",
		description: "Поможем собрать несколько товаров в единую поставку",
		steps: [
			"- Предоставление места на складе",
			"- Приём продукции от разных поставщиков",
			"- Отправка единой партии",
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Брендирование",
		description: "Выпуск готовой продукции под Вашим брендом на китайских производственных площадках",
		steps: [
			"- Полное сопровождение «под ключ»",
			"- Помощь с ОЕМ-соглашением"
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Консультирование",
		description: "Поможем разобраться в теории и практике международной торговли",
		steps: [
			"- Консультирование со специалистом",
			"- Поможем составить план поставки",
			"- Помощь в решении проблем с импортом",
		],
		price: "от 2000 ₽"
	},
	{
		title: "Платежи",
		description: "Осуществление оплат за товары/услуги",
		steps: [
			"- Перевод на банковские реквизиты контрагента",
			"- Перевод на AliPAY и WeChatPay"
		],
		price: "Персональный рассчёт"
	},
	{
		title: "Исследование и маркетинг",
		description: "Поможем разобраться в рынке услуг и товаров Китая",
		steps: [
			"- Анализ рынка и конкурентов в Китае",
			"- Поиск трендовых и нишевых товаров",
		],
		price: "от 5000 ₽"
	},
]

export const ServicesFull = () => {

	const [findServices, setFindServices] = useState<number>(-1)
	const [toogleMore, setToogleMore] = useState<boolean>(false)

	const scroller = useSmoothScroll()

	useEffect(() => {
		const [block, service] = window.location.hash.split('/')
		if (block == "#services" && service){

			if(SERVICES[Number(service) - 1]){
				setToogleMore(true)
				setFindServices(Number(service) - 1)
			}
			scroller("services")
		}
	}, []);

	// useEffect(()=>{
	// 	if(Number(findServices) == -1 && !toogleMore)
	// 		return

	// 	scroller("services")
	// },[toogleMore,findServices])

	return <section id="services" className="pt-20 min-h-screen flex items-center">
		<div className="container mx-auto px-8">
			<h1 className="text-4xl font-bold text-center text-indigo-900 mb-12">Услуги</h1>
			<div className={`relative ${toogleMore? "":"h-[500px] xl:h-[600px] overflow-hidden"}`}>
				<div className='grid md:grid-cols-2 xl:grid-cols-3 gap-10 mx-2 p-1 md:mx-10 md:p-5'>
					{SERVICES[findServices] && <ServiceCard key={findServices} {...SERVICES[findServices]} blur={false} find={true}/>}
					{SERVICES.map((item:IService,index:number) => {
						if(index != findServices)
							return <ServiceCard key={index} {...item} blur={!toogleMore && index > 2} find={findServices == index}/>
					})}
				</div>
			</div>
			{!toogleMore && <button onClick={()=>setToogleMore(true)} className="w-full m-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex justify-center items-center space-x-2">Показать ещё</button>}
			{toogleMore && <Link href={"#services"} onClick={()=>setToogleMore(false)} className="m-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex justify-center items-center space-x-2">Скрыть</Link>}
		</div>
	</section>
}

const ServiceCard = (service:IService) => {

	const [showMailForm, setShowMailForm] = useState<boolean>(false)

	return <div className={`${service.find?"bg-blue-300/30":"bg-white"} border-4 border-blue-700/80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden`}>
		<div className="p-6 flex flex-col justify-between min-h-[400px]">
			<h3 className="text-xl font-bold text-indigo-900 mb-2 h-[10%]">{service.title}</h3>
			<span className={`text-gray-600 ${service.blur?"blur-xs":""} h-[10%]`}>
				{service.description}
				{service.steps.length > 0 && <hr></hr>}
			</span>

			<ul className={`${service.blur?"blur-xs":""} h-[70%]`}>
				{service.steps.map((item,index) => <li key={index} className='font-medium '>{item}</li>)}
			</ul>
			<p className={`font-bold text-green-700 text-center ${service.blur?"blur-xs":""} h-[10%]`}>{service.price}</p>
			{/* <button className={`font-bold text-green-700 text-center ${service.blur?"blur-xs":""} h-[10%]`}></button> */}
			<button onClick={() => setShowMailForm(true)} className="w-full h-1/12 m-1 bg-gradient-to-r from-gray-500 to-indigo-600 text-white p-1 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex justify-center items-center space-x-2">Связаться с нами</button>
		</div>
		{showMailForm && <MailFormFull close={() => {
			setShowMailForm(false)
		}} coment={`Хочу получить консультацию по услуге "${service.title}"`}></MailFormFull>}
	</div>
}

interface IMailFormFull extends IMainFormFull{
	close: () => void
}

const MailFormFull = ({coment,close}:IMailFormFull) =>
	createPortal(
		<div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 md:p-8 z-50">
			<div className="bg-white rounded-lg shadow-xl md:max-w-7/12 w-full max-h-full overflow-y-auto relative">
				<button
					onClick={close}
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-50 p-2"
					aria-label="Закрыть"
				>
					<XMarkIcon className="h-8 w-8" />
				</button>
				<div className="p-6 md:p-8">
					<MailFormMini close={close} coment={coment} />
				</div>
			</div>
		</div>
	,document.body)