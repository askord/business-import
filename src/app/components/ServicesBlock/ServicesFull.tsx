import { useSmoothScroll } from '@/app/hooks/useSmoothScroll'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { IMainFormFull, MailFormMini } from '../MailFormBlock/MainFormFull'
import { XMarkIcon } from '@heroicons/react/24/solid'

import axios from 'axios'

interface IService{
	id?: number
	title: string
	description: string
	steps: string | string[]
	price: string
	blur?: boolean
	find?: boolean
}

export const ServicesFull = () => {
	const [services, setServices] = useState<IService[]>([])
	const [findServices, setFindServices] = useState<number>(-1)
	const [toogleMore, setToogleMore] = useState<boolean>(false)

	const scroller = useSmoothScroll()

  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get('/api/services');
      setServices(res.data);
    };
    fetchServices();
  }, []);

	useEffect(() => {
		const [block, serviceId] = window.location.hash.split('/')
		if (block == "#services" && serviceId){
      const index = services.findIndex(s => s.id === Number(serviceId));
			if(index !== -1){
				setToogleMore(true)
				setFindServices(index)
			}
			scroller("services")
		}
	}, [services]);

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
					{services[findServices] && <ServiceCard key={findServices} {...services[findServices]} blur={false} find={true}/>}
					{services.map((item:IService,index:number) => {
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
  const steps = typeof service.steps === 'string' ? JSON.parse(service.steps) : service.steps;

	return <div className={`${service.find?"bg-blue-300/30":"bg-white"} border-4 border-blue-700/80 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden`}>
		<div className="p-6 flex flex-col justify-between min-h-[400px]">
			<h3 className="text-xl font-bold text-indigo-900 mb-2 h-[10%]">{service.title}</h3>
			<span className={`text-gray-600 ${service.blur?"blur-xs":""} h-[10%]`}>
				{service.description}
				{steps.length > 0 && <hr></hr>}
			</span>

			<ul className={`${service.blur?"blur-xs":""} h-[70%]`}>
				{steps.map((item: string, index: number) => <li key={index} className='font-medium '>{item}</li>)}
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
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 md:p-8 z-50">
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