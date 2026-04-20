import { ChevronLeftIcon, ChevronRightIcon, LinkIcon, XMarkIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {createPortal} from 'react-dom'
import { BounceLoader } from 'react-spinners'
import { IMainFormFull, MailFormMini } from '../MailFormBlock/MainFormFull'

interface IPrice{
	approx_price_rub: string
	min_quantity: string
	original_price_cny: string
	price_rub: string
	price_usd: string
}

interface IItem{
	approx_price_rub: string
	dimensions: {
		height: string
		length: string
		weight: string
		width: string
	}
	id: string
	image: string
	location: string
	original_title: string
	min_order_quantity: string
	price_cny: string
	price_rub: string
	price_usd: string
	quantity_prices: IPrice[]
	title: string
	url: string
	vendor: string
	selected: boolean
}

export const ChatFull = () => {

	const [title, setTitle] = useState<string>("")
	const [minPrice, setMinPrice] = useState<number>()
	const [maxPrice, setMaxPrice] = useState<number>()
	const [volume, setVolume] = useState<number>()

	const [load, setLoad] = useState<boolean>(false)

	const [showMailForm, setShowMailForm] = useState<boolean>(false)
	const [showItem, setShowItem] = useState<number>(-1)
	const [page, setPage] = useState<number>(1)
	const ITEMS_PER_PAGE = 2

	const [items, setItems] = useState<IItem[]>([])
	const findItem = async () => {
		let query = ""
		query += "language=ru&"
		query += `framePosition=${0}&`
		query += `frameSize=${30}&`
		query += `ItemTitle=${title}&`
		query += `MinPrice=${minPrice}&`
		query += `MaxPrice=${maxPrice}&`
		query += `MinVolume=${volume}`
		setLoad(!load)
		axios.get(`/api/search?${query}`)
			.then(responce => {
				setItems(responce.data.items)
				setPage(1)
			})
			.then(() => setLoad(false))
			.catch(() => setLoad(false))
	}

	const prepareForm = ():string => {

		let result = "Вы отметили товары:\n\n"

		items.filter((item:IItem) => item.selected).forEach((item:IItem) => {
			result += "\t => " + item.title + "\n"
			result += "\t\t" + item.url + "\n\n"
		})


		return result
	}

	const toggleSelected = (index: number) => {
		// Обновляем глобальный индекс в массиве items (учитывая пагинацию)
		setItems(prevItems =>
			prevItems.map((item, i) =>
				i === index ? { ...item, selected: !item.selected } : item
			)
		)
	}

	useEffect(()=>{
		localStorage.setItem("card",JSON.stringify(items.filter(item => item.selected)))
	},[items])

	// Отображаемые товары на текущей странице
	// const displayedItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
	const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

	const handlePrevPage = () => {
		if (page > 1) setPage(page - 1)
	}

	const handleNextPage = () => {
		if (page < totalPages) setPage(page + 1)
	}

	useEffect(() => {
			// Отключаем или включаем прокрутку страницы в зависимости от состояния модального окна
			if (showItem > -1 || showMailForm) {
				document.body.style.overflow = 'hidden';
			}
			if (showItem == -1 && !showMailForm) {
				document.body.style.overflow = 'auto';
			}

			// Очистка эффекта при размонтировании компонента
			return () => {
				document.body.style.overflow = 'auto';
			};

		}, [showItem,showMailForm]);

	return <>
		<div className='p-2 bg-gray-500/30 h-auto rounded-xl flex flex-col'>
			<div className='h-4/12 bg-gray-900/80 m-1 p-2 rounded-xl flex flex-col'>
				<input value={title} onChange={(e)=>setTitle(e.target.value)} className='border-2 m-1 p-1 text-center border-gray-800 bg-gray-100/20 text-white rounded-xl' type='text' placeholder='Наименование товара' />
				<div className='flex'>
					<input value={minPrice} onChange={(e)=>setMinPrice(Number(e.target.value))} className='border-2 m-1 p-1 w-full text-center border-gray-800 bg-gray-100/20 text-white rounded-xl' type='number' placeholder='Мин. цена'></input>
					<input value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} className='border-2 m-1 p-1 w-full text-center border-gray-800 bg-gray-100/20 text-white rounded-xl' type='number' placeholder='Макс. цена'></input>
				</div>
				<input value={volume} onChange={(e)=>setVolume(Number(e.target.value))} className='border-2 m-1 p-1 text-center border-gray-800 bg-gray-100/20 text-white rounded-xl' type='number' placeholder='Кол-во товара'></input>
				<button onClick={findItem} className="w-full m-1 bg-gradient-to-r from-gray-500 to-indigo-600 text-white p-1 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex justify-center items-center space-x-2">Поиск</button>
			</div>
			{load && <span className='self-center'><BounceLoader size={35}/></span>}

				{!load && items.length > 0 && (
					<div className='h-7/12 bg-gray-900/80 m-1 p-2 rounded-xl relative'>
						<div className='grid grid-cols-2 place-items-center'>
							{items.map((item, index) => {
								// <MiniCardV1 key={index} item={item} select={()=>toggleSelected(index)} view={()=>setShowItem(item)}/>
								return <MiniCardV2 key={index} item={item} select={()=>toggleSelected(index)} view={()=>setShowItem(index)} show={((page - 1) * ITEMS_PER_PAGE <= index) && ((page) * ITEMS_PER_PAGE) > index}/>
							})}
						</div>
						{totalPages > 1 && (
							<div className='flex justify-center items-center mt-2 space-x-4 text-white'>
								<button
									onClick={handlePrevPage}
									disabled={page === 1}
									className='px-3 py-2 bg-gray-600 rounded-full disabled:opacity-50 hover:bg-gray-500 transition-colors w-10 h-10 flex justify-center items-center'
								>
									<ChevronLeftIcon className="w-5 h-5" />
								</button>
								<span className='px-4 py-2 bg-gray-700 rounded-full'>{page} из {totalPages}</span>
								<button
									onClick={handleNextPage}
									disabled={page === totalPages}
									className='px-3 py-2 bg-gray-600 rounded-full disabled:opacity-50 hover:bg-gray-500 transition-colors w-10 h-10 flex justify-center items-center'
								>
									<ChevronRightIcon className="w-5 h-5" />
								</button>
							</div>
						)}
					</div>
				)}
			<button onClick={() => setShowMailForm(true)} className="w-full h-1/12 m-1 bg-gradient-to-r from-gray-500 to-indigo-600 text-white p-1 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex justify-center items-center space-x-2">Связаться с нами</button>
		</div>
		{showItem >= 0 && <ItemFullView item={items[showItem]} close={() => setShowItem(-1)} select={()=>toggleSelected(showItem)}/>}
		{showMailForm && <MailFormFull close={() => {
			setShowMailForm(false)
		}} coment={prepareForm()}></MailFormFull>}
	</>
}

interface IItemFullView {
	item:IItem
	close:()=>void
	select:()=>void
}

const ItemFullView = ({item,close,select}:IItemFullView) =>
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
				{/* Заголовок */}
				<h2 id="modal-title" className="text-xl font-bold mb-4 w-10/12">{item.title}</h2>

				{/* Основной контент: изображение и детали */}
				<div className="flex flex-col md:flex-row gap-4">
					{/* Изображение */}
					<div className="md:w-1/2">
						{/* <Image
							src={item.image}
							alt={`Детальное изображение: ${item.title}`}
							className="w-full h-auto rounded-lg"
						/> */}
						<Image
							src={item.image}
							alt={item.title}
							className="w-full h-auto rounded-lg"
							loading='eager'
							placeholder="blur"
							blurDataURL='data:image/jpeg;base64,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'
						/>
					</div>

					{/* Детали */}
					<div className="md:w-1/2 flex flex-col justify-between">
					{/* Описание */}
						{/* <div>
							<h3 className="text-lg font-semibold mb-2">Описание</h3>
							<p className="text-sm text-gray-700">
								{item.description || 'Подробное описание товара отсутствует. Свяжитесь с продавцом для дополнительной информации.'}
							</p>
						</div> */}

						{/* Цены со всеми опциями */}
						<div>
							<h3 className="text-lg font-semibold mb-2">Ценообразование</h3>
							{item.price_rub && <p className="text-lg font-bold text-blue-400">От {item.price_rub} ₽ ({item.approx_price_rub} с доставкой)</p>}
							{item.quantity_prices && <>
								<ul className="text-sm text-gray-700 space-y-1">
									{item.quantity_prices.map((qp:IPrice, index:number) => (
										<li key={index}>
											{qp.min_quantity} шт.+: {qp.price_rub} ₽ за штуку ({item.approx_price_rub} с доставкой)
										</li>
									))}
								</ul>
							</>}
						</div>

						{/* Характеристики */}
						<div>
							<h3 className="text-lg font-semibold mb-2">Характеристики</h3>
							<ul className="text-sm text-gray-700 space-y-1">
								<li><strong>ID:</strong> {item.id}</li>
								<li><strong>Размеры:</strong> {item.dimensions.height}×{item.dimensions.width}×{item.dimensions.length} см</li>
								<li><strong>Вес:</strong> {item.dimensions.weight} кг</li>
								{/* {item.rating && <li><strong>Рейтинг:</strong> {item.rating}/5 ⭐</li>} */}
							</ul>
						</div>

						{/* Отзывы (если есть) */}
						{/* {item.reviews && item.reviews.length > 0 && (<>
							 <div>
								<h3 className="text-lg font-semibold mb-2">Отзывы</h3>
								<ul className="text-sm text-gray-300 space-y-2">
									{item.reviews.map((review, index) => (
										<li key={index} className="bg-gray-700 p-2 rounded">{review}</li>
									))}
								</ul>
							 </div>
						</>)} */}

						{/* Действия */}
						<div>
							<div className="flex gap-4 mt-6">
								<button
									onClick={select}
									className={`flex-1 p-3 rounded transition ${item.selected ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
								>
									{item.selected ? 'Выбрано' : 'Выбрать'}
								</button>
								{/* <button className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 rounded transition text-white">
									Купить сейчас
								</button> */}
							</div>
							<div className='flex text-blue-600 font-bold'>
								<LinkIcon className='w-5 mr-2'></LinkIcon>
								<Link target='_blank' href={item.url}>Ссылка на источник</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	,document.body)


interface IItemMiniView {
	item:IItem
	select:()=>void
	view:()=>void
	show: boolean
}

// const MiniCardV1 = ({item,select,view}:IItemMiniView) =>
// <div
// 	className={`bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/50 transition-all duration-200 relative ${item.selected ? 'ring-2 ring-green-400' : ''} w-full h-full`}
// >
// 	<img src={item.image} alt={item.title} className="w-40 h-40 object-cover rounded mx-auto mb-2" />
// 	<p className="text-white text-sm truncate text-center">{item.title}</p>
// 	<p className="text-white text-center font-bold">{item.price}</p>
// 	<div className="flex flex-col items-center md:flex-row ">
// 		<button
// 			onClick={select}
// 			className={`w-full flex-1 p-1 m-1 text-xs rounded ${item.selected ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'} hover:bg-opacity-80 transition-colors`}
// 		>
// 			{item.selected ? 'Выбрано' : 'Выбрать'}
// 		</button>
// 		<button
// 			onClick={view}
// 			className="w-full flex-1 p-1 m-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
// 		>
// 			Посмотреть
// 		</button>
// 	</div>
// 	{item.selected && (
// 		<div className="absolute top-1 right-1">
// 			<CheckBadgeIcon className="w-6 h-6 text-green-400" />
// 		</div>
// 	)}
// </div>

const MiniCardV2 = ({item,select,view,show}:IItemMiniView) =>
<div className={`m-2 ${show ? '' : 'hidden'}`}>
	<div className={`md:w-full bg-gray-700 rounded-lg overflow-hidden ${item.selected ? 'ring-2 ring-green-400' : ''}`}>
		{/* Изображение */}
		<div className="relative">
			<Image
				src={item.image}
				alt={item.title}
				className="object-cover rounded-xl p-2"
				width={800}
				height={800}
				quality={80}
				loading='eager'
				placeholder="blur"
				blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAJmAmYDASIAAhEBAxEB/8QAHAABAQACAwEBAAAAAAAAAAAAAAcGCAIEBQMB/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAABqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABxOSeZAZGBKKvEDFrPBrMUQAwUzpiOXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA88+Bq57nW8w2n5zWlCIW+IGCWaM2YogPI1xzHCT92Xjt0AAAAAAAAAAAAAAAAAAAAAAAAAAAAABxOTA81PuDA4jtVr4eHslrFRiyRC3xAwSzRmzFExLK9dTwfr8qgUP1wHlnqMMzMAAAAAAAAAAAAAAAAAAAAAAAAAAATyh44a8en2PELdnmquTmweOMjNV1R/Sg4ln/MgtWyQYFEtm5IYhsjiObD44XIygzH4DlsbIbWd4AAAAAAAAAAAAAAAAAAAAAAAAAAAHCcUoawdTZ2Tk8qMuqRVgAAAIBf9fzFXaqhO69l/MAAAAAAAAAAAAAAAAAAAAAAAAAAAAJT45bkRFuREVn0sAoQAAAA6nbHT7ki84tyIi3IiLcwXOgAAAAAAAAAAAAAAAAAAAAAAAAADWXz715ZGVmEZWYYRe8cyMAAAAA1a+V288jKzCMrMMTuHge+AAAAAAAAAAAAAAAAAAAAAAAAAAAAOOKSAp+XayUAtQAAAGO5FrWWfLdVc0Ls8f2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAYKZHIsO+R+/n1pZgFjy7sBAPw2AdTtgBjsNNlJV+VY1b+OysiMMpMy/DaHs6y7AHtAAAAAAAAAAAAAAAAAAAAAAAAAAAYjlw1WzWxekeR64MEzXW88vt9SvGfy6vRAwm4QqzHrwLaqEmI7Ha15wXIGKx/YriaxbI8PRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5hPZV9/ge1sbiGZCIW+IGCWaM2Yonj+wNWvnTZiX/K9ddiDkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhuZDVfL693TvARC3xAwSzRmzFEB1tbtmvENe9j+XeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGCZ2IjTsgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAqEAABBAIBBAEEAgMBAAAAAAAEAgMFBgABEBQWNVAwEhMVYBEgITOgNP/aAAgBAQABBQL/AL97dIkNFdcXlWNdMj/0RStJTI2dhlULKtybPNy8tlJ8fzNWBIBEXPCnfoFy+7+MyHO3HnIVpaOLl5bKT4/iVNSAC6tTrmRn3dR/vn2kPsyIiwTMp8h9xri5eWyk+P4tMh1huVaP6w39Atkf1ImCPrFJCJQWLly8tlJ8flkkOhAxpCnXIoJIAPu1K0lOrQF99l5t9vmwR/48/KhIfZIy5eWyk+PUrSUzR25A7KdH/Urk88cFuPsIphPt7ibtkXATiAXIqxsE8zwH5ADev42ne0qiiFFR1lhnjnu3JLICP3Gg3ElbMfgAqzSx2UDsY862y3K2fHnVvOJ3tKoYzro7201FNybMjGEx6uIuaKj8jJgWQ1lggXnS4usYhKUI5OEZNYkKyS0utxG49vJWxji4ccQc5xFQJJuBCthje3WlK0ytZQ5hI7orua3/ABuszT7pXwy80QeriOjSZBcVADBe8LFYLala06zitbTunR/+fhsUf0B447pLsVWEIxCEto98VHCFLQlKEfCUMyU2KKwKj3UpZXmjO6D87oPzug/O6D87oPyAnlnEfGdaH9E90H53QfndB+d0H53Qflem1SLntJD/AN/9ap5v43P9n9ab5f2khXxDH+1BM7UEztQTO1BM7UEyLhxo1Xxm1wMp/tQTO1BM7UEztQTO1BMi4oeN17lStJSZZxGXQS2jRvhl5ZmMTGTwh2/fSs6KDklKFSCsp5qmjvhlDFHG5FWAkPI6SGPR7qQkRgESthJM5CDfNcg4JEev4Zes7+p1tbS8bWptcVZ1Iwd9olr29olHQG3HFurxttbq4qsbVjDDY7eWGSUeZFzZQGCPpKG5nJPUYMfIEnrqElv6sPjxj0SteJE5DMfDdhjNnx/trLH9cBkVXiS8j44YBHFskOlDwVhZJAQ6RRbkY9ov7i8qZTpMbZQNnR+NOKacizEnhcSkGKfklElR+xWFkkBDIDF9voATT/LzqWWpItZxmU6P+hvLl5bKT4/LRH9GdlVkOkN5VrStDhDDL95cZDiICVIHNoS2jLl5bKT4/JYJJ4LiFNuZXJDrwPfyRaQQnnVvO5WI/ogeLl5bKT4/i4x/0uZCH7jz070pPvrSE8YArW07rMf1p3Ny8tlJ8fwSwgkc4VYZYw7pTsewoYH358WIdsMRkNnm5eWyk+P5kIsQ/YgjAbf6LYYRci52ufkJH/jQ/wDv3//EABQRAQAAAAAAAAAAAAAAAAAAAKD/2gAIAQMBAT8BPj//xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAECAQE/AT4//8QAQBAAAgEBAwcHCgUDBQEAAAAAAQIDABAREgQTITEyQVEiI1BhcXPBFCAwM1KBkqGx0QVCU2CRYoOgJDRDcpOi/9oACAEBAAY/Av8AP3TJoJGjTDiOE3E1/up//Q0TOcTo2HFx/YpZiAo1k1gyRM+d7ahTELgkTaS/zB3Q8bJ+98B5mYijzsg2tOgUEbmZvZbf2H9gLm783j5d1iTDY1OOIoMhvUi8G0d0PGyfvfAWyTtrGhRxNM8hvdjeTZk/lF+dwDFf0+8UgvRxcakgf8p0HiLDkcp5SaU7LR3Q8bJ+98BbmozzMOjtO+zOyDmYdPad37B8ojHOw6+tbI5ottDfUc8Wy4/iwd0PGyfvfAWEIeel5K9XXYqRi92NwFRwLrGljxPThZjco0k1gKyhPbuoSQurod48xlUcy/KT7WHJJDyJdnqawd0PGyfvfAUWY3KNJNPL+QaEHVYctlGgcmPxPmYspkC8BvNCHC8bNs4t/TCZMmubaPVZjyaQrxG40Eyq6CXj+U2sgHOryk7auOugVNxFQTOLmZdNJPktxcLhKk3V6lfjFZtyDIzYmupIk0Z43MeqyOCPWx18BSRRC5EFwsLyuqIN5ox/h4/usPoKLyuXc6yaBU3EVFMdo6G7el1DNgkTZaufTkbnGo2hVbOQ/pt4VcjYJf0212HKMhQMH0st91xoP+IH+0p+poKgAUaAB5hiyhcS/Sr8k5+P+CKaXKLvKH0f9RYUya6eX/5FYspkLcBuFod+Zh9ptZ7BSQQ7C9MFXUMp1g0ZMgObb9M6qMeURsj8DZeNdJkmUnOBtljrHomUNm8n3IN/bbdAnJ3udQoPJz03FtQ7B05m8ojDr17qMmREyp7B2h96IYXEbjTZdIP6Y/E+iOEczJyk+1COCNnc7hQky842/TXV76CooVRqA6fD5RAjtxoKgCqNQHosGURrIvXWHJ4ljHV03JFkiR4EOHE2m+tmD4T962YPhP3rZg+E/etmD4T962YPhP3ryfKUUORerL6R1yWOPNKbgWF5NbMHwn71swfCfvWzB8J+9bMHwn71swfCfvTQzoqygYgV1HpXKe8b6+dD2N9PSN2+ce7Ph0qZiZI3bawb69dP8q9dP8q9dP8AKvXT/KvXT/KmeLE0h0Yn9I0t8kbNpIU6K9dP8q9dP8q9dP8AKvXT/KvXT/KmzGIu2tm19NFmICjWTWCFWm4sNApZ4DyT8vRLnAXkbUgrBfmZfZff7+nygOem9hd3aa557k3IuqzyY+rm+R9FJO2/ZHAWBJefh4NrHvq/J35W9DrHTd+USXHco1mikPMQ8BrPvtwZNGXO/gKz0rZzKLt2pfRNL+HnXpzR8KKSqUcawbA8bFWGoihH+IDEP1F1++hJA6uh3jpiOPJ9Ekl/K4Ci8jFnOsmwJGpZzqAoSfiBwj9NfE0I4EVEG4WMEb/TpoQceugt+dh9hvCo549lxf5gfDjkY3KKxZRISNyjUKORTNfvjv8ApZhyiO/gw1ii8HPw9W0PdbjyaQofrUc7DCx0EdfS96DnouUvXxFgebmIevWfdWHJ47jvY6zb5PGedm+S2RwxC93NwqKBNSC6kydHKxYMRAOs1tN/NNnmLGN8IJ4UcHrYuUvX1WLJGbnU3g1HOus7Q4G0tdmpvbXf21zqXx7pF1UkMQvdzcKjgj2UH89MZ4ZPFndeLD5jySG5FF5NSTv+bUOAsOWyjlNoj7ONg7oeNk/e+AszkY5mbSOo7xZmZDzM2jsPmEMLwdxotBBHGx3qOnRkMR/qk8BYkI2dbngKVEFyqLgLB3Q8bJ+98BY8J2tangaZHFzKbiLBjPPR8l+vr/YEk7/l1DiaeSQ3uxvJsxyDnpuUeobhaO6HjZP3vgLRlsQ5LcmTt42JJ/xnkuOqgVN4PT6+TjE0bYsPGiGFxG41ikHMxcpus7h5g7oeNk/e+AteGUXo4uNSQSa0P80I4ELudwqCFzeyIAT+wL8oiBb2hoNZrJ0wJ5g7oeNk/e+A8xTlEd7D8wNxrBk0YRerf+xkmgdVlAwkNqNbUHxH7VmsWJycTHr/AM/j/8QAKxABAAECAwcEAwEBAQAAAAAAAREAMSFBURAgYXGBkfBQsdHxMGDBoaDh/9oACAEBAAE/If8Av3i068wVz0woK3i8aR23NcQJPHH9FLGkogCsBhcR7OtTNtDSjRHTc87rvIIIwS2PB50wyXCfBf6foAnKA8rKeE/zZNY2TNv89KHYUCyO3zuu6giQSl5tilutOzWi+FAFLjiYz4+vzkpLg1jHvsA7Lbvj55zp/eG3zuu6glZLJi2a/my+xBz0X9+/0GPnlML5na/fYoUQXHhTYXEaszo7PO67iDDmmhuM+j3di3SjZrUSCUPPu+uF6DIsFJUgwRxziZirRBHk2oJDiNJmEuhn0fGy6PTPsdfeNnnddqAvQZFgrFr0sfm+zNdQc3wO+5iaFnHllGl9DjC0ws+sS8kzwOXXZIQ83mlQ/ThJ/wBsuvehEEZHYY1ffZ1pEBBgjlShFSJcagXO89pp0rw8BUR60SWPPWpZ1ZQYCDtUuIhGjGOuzXPXcNRDBLZdXC8Fdm/Ed+1XN0uVpQipEuNIXgugwfn1dEEqMmJuJpUdxTGL62XXahqAuBzZUY17g9GuzDsOws1J1p5hzxfB3o1rgGAbkrVxMlajUuRLCnPTg0WkHAM8CaWCW1YBzhI9xz6VhyHB5Zth7PjBgUE4g4Tdc19YFsEDkahruq4+Tl5ajgLJvy12ICIMRMqSOBL6CYXO34VgVsUvyTJw93ttljixget8VDUPGLE8MfXHWS2bkcqzen7BRSioQhKewiZfDh3/ABKGKbQNej4rKhI+RUDdybDzZ+Xop3wOA9fDDc5D1i9GvOBQB+LF3MwbPDSpHreN+bn63OlNCpmDmQb0SJEiRG6eSIMXEfyEmoRQc770SJEiRMe8MQM8HPH1UQDf+zeHmZ/yGBby3h4efqrF8NIQtYS9fdfGvuvjX3Xxr7r41918ajh2TChoR+SQvYVJ1hK+6+NfdfGvuvjX3Xxr7r408DBHzDTgetFjSUQBUCOXPYm9Moctusx/FzrJsauhQFJcBv8AGb1/Bac3Bf4e9Z4mcEfnrsRzIKGiTPYjt+FYFbFScg40Gxsk8jhNhcP4ag1QTgel63E8pmuUViHTCXvfwbdW2PccqMHwBqrxrzpQJWDfUCVg2NGMpYMc38awXsjhNi6PlcJUlNuLByZ9Ktg0WfWIZypZMWnGmN7K5XYxvYHK1q1k2L7HSrVFBilgltSsJ4Dh/wCvtTgRc+3Nl7VPbh83OG5crLsHN4VEUtFyinswkqtr/ffZEUzQctrFOGOHuZum3W1oW5jOhUyhWgxh6vOTp4bjw7bMR6Yye1/TUDSkYrnu2yEoY6j1t32fZkArEZPNz1aB7BAplv2oBkJ5qNHYlKwHHvTEVwo7uz22N5KNklR0gRo9zbeF5d3Bn70xcbzD+OtfZoArKPE6s3q+sQGpWEzrz3C7taYKw25e1GzNZScs3V5fZ53XcQS0RmLwM9lkqGK2W/zcEoKEJGsOfSEfXenMPhx7bJRy2ZN/jrQETAZBs87ruII1xEvJs+a0idxmSbIxJHqaOr3n9AjyYe1FM3a1y7IyJFL4GfXb53XdQZNqBlk6rfexgr108+l6EIKRLJ6+bJKTcwmHGlKOhCEqPmxyW8Dtued13UEwgCrKXk6MnqVl18LcXQogpSWmP0AMU5/+hei4wZi6uq7nndd5BA3cCINK1jdm5m7+jYxaZgTJiZ40VcOeWx2yYcMP+/j/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPOPPPGPOPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPLJPPKPNDPPPPPPPPPPPPPPPPPPPPPPPPPPPPPONPEKPKMPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPLCLGDDECIDNPPPPPPPPPPPPPPPPPPPPPPPPPPPPLNGPPPPCOFPPPPPPPPPPPPPPPPPPPPPPPPPPPPMMMPPPPPLEMMNPPPPPPPPPPPPPPPPPPPPPPPPPPHPPNPPPPPFPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPKCPPPPJONPPPPPPPPPPPPPPPPPPPPPPPPPPPPOLHIGNPJLEFEPPPPPPPPPPPPPPPPPPPPPPPPPPPPFPMKLKOGPDHPPPPPPPPPPPPPPPPPPPPPPPPPPPPPONDPKLDNPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPLLPPKPDLPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP/xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAEDAQE/ED4//8QAFBEBAAAAAAAAAAAAAAAAAAAAoP/aAAgBAgEBPxA+P//EACsQAQABAwMDBAICAwEBAAAAAAERITFhAEFREHGBIFCRoTBgsdGgweHw8f/aAAgBAQABPxD/AD9wYBiBgEVgWDWWZppIRJUShpy8zg45CRO8E1n9FRwooFdVoGdL1wSp90L3wHC6QAJQE7ISodpEThfSy+y9FCt6TRJKRWCLYJLsxLloC4FA7GHgf0BBrA0ksT4nz0S4R55EO5AMjTTbNkaRMI+ll9l1qkCA/qW7gdXQiROlfl0kDKdo0NYSnNJ/onM+/gvUPcIY4eHZ1KDYuB6n3I7Mm3SroxVWb5UyY4eky+y61daiuFlBIYFL9IWCxFL+UIl2B/QVdQwHLGZUYy6Qza44XWEkcLqV4UplsLkEe3oZfZdI4B8tYfWQMGel1IkToD5dUIYB/StjAe+IlyjAiVXYDVcrNR5GDwXGi1nJbYks4udWQgIRJE05Ak2ivyKnaW/R42mapB9CR2cvQy+y1MlyjAiVXgDSuQ03eMMc1LLG3S/5hKQwPYYZdx6JDQL4wOr3sbpqD5KuOkmTYs2mYn3de4UKQ5PkTwJv0mlibC4ej3ubJqjIgqHD+tGWiZAkRkTouJPbsCs+BTvDtptaoEKLiaHYp+AMiOyOorTCIEygbCkmHQrPCJQBSahFLGkgSLEsBosXwtXAZiQBWLrqcMu1GLzJ4E36FhEaCQqvgBc230fXHEF3lbrur0Js0ll5d8b6Vod19hv5/u0tbpT8x/jQ7FPwBkR2R1MX0wgnkMMdkx7u83lAKHJKDcRO4t3NQv8AvGIOOsVJagl8j7U5HU2qKgk3nY9q8h0aauSUQEuazK7aWfBkkLgP4/q1CuW4IgA2A9Ek5jDDzG2SX5RkdN1H4GwjuD4NLQkRibNKirCxSgFpQRABKtjUOpZV/h+vyNV3cp0HB0O93desusOX+EL3YOF0leQnLlUcqr/FPeH8eIndkaJqXASmX8y8MnZq7EWBDlWGRTo2tRCFFkdV575I+KoqtZisfhJxASukq1jbmiyrePhv1mHVDd/ucScaoCtC/ODyl3It74re1AqclVZE1CG5UQX0HaHDpe+FCC4jUdMZgCF1oPiT3/FZ2lYUV+0/DpaSNMg5WwywGoQ1AQfAqwQZGo0wIn4AoHv8BFwloWFBGGdClgTGsAUD8UBkhmZFdZHTphSIV83F3X3s5tVdagASCF1iZJj1WLFixYNtlsClQ1iWRilvyTykrQi0ANwic+qxYsWLCK+DA0AooIN4a0Ir7owxAaO3qmWBQdx+RQQgNHar6kXBQZx7qM/Cg98kQt0ibpLPqMmTJkzeBqEooAAUNppf8hySZFLKEQrVhjHqMmTJkyejwOgrCAJKwFaSsHvS+lFgrqtA1KS8HD31fEOF1KRcRg9lsn9JRPxV0XUghdncpurYowo8YUD4tLDDwPv8AUog/IDsJw0rlGouPJuzJ4jo3UqCi48kX9PwlTQS6d6S14nx1eVXfpQSAfZUx3DYjVhkCd/vMkmfe6skP+fuWDOpITyo/FYcBsz1PgMQkC7vQd77TqZeDiIUVapJJRRaadCC6sHrdCC6sHQHujwk1R6RxBHO2m4xI3ZHpIRIF/IlTUMrgBCw07oOF1sTWUPCXHkYT3iNeiigFLSS3ZiLVkmCYG/lWr0mSYG/gCrqSGiJ+IKdknJq18Nx3eXlaugRABKtjSjabUqKN1TE2gc6TagFCH5e2uGqeACbl1kZHt6A8FpYISpwpQqqFLiloT8TtPLK7rpV0J+wJJdooNo5HSM+o+Nmvhkdx1CicTRcFhzLlDSIw0egKkcyTNnoO5qqVvtaTLZgY2mKx7ujfEQmB9gCZBvqGYivGocx1n81hwcg6/8AUGGyYIMdYWc7KtvFsYw6QknLYm64AlXYHS9IpeZcyqvnSXNiRLZcAQPLosMMiEj86ZExaEwmqiiXaONOPVvwj5moyDfpcMJAqR+TVHMWf/o6nIjv1POtMH6E76Zam5UJPElu8QxOo3/lsTdcASrsDo6KeYhuLlF8+8Ok2l+pUyv6G6HDYS+calMoVZBofYvyq79BiQxG/HeRBgdvQZfZdKniTFJ5wEsMMFukfKZVwcY3dxbehe+BAG4jc0NQWCjgdjBT32XaJS8r9P8A76GYh5LEu7QZGgTYfAaAMAehl9l0sH4Mz4LjhaOR48LoR7JoUZKOghvynY+sM4foCeUhdiWh92/ALtpmjw3EvYx0o6gArH4KMsw29LL7LrUaEAbEeISyG/QvQkKsgmHKgdo30OxT8oJEdxPf+RAsjIbiZDcmKwK94KEFxGo6q+eAuvJKS4Rv6mX2XW5J/gDZOEYR2Q0VDNEYHqOEHzpBdUlQ5LBusBpnbEKhUE7FjAfoEIowRHwwQwzG2kHQYVK6JVoVeAt6mX2XosgbtJJGpK0ZiWLuht54JTlpTKv6MbsLgNIAoFFoaVIqpBAd2hoNE5KNBANYAK3q0mD/AD9//9k='
			/>
		</div>

		{/* Информация о товаре */}
		<div className="m-2 flex flex-col items-center">
			<h4 className="text-sm font-medium text-white line-clamp-2 mb-2 max-w-[70%] break-all">
				{item.title}
			</h4>

			{/* Цены */}
			<div className="mb-2">
				<span className="text-lg font-bold text-blue-600">
					<p className="text-lg font-bold text-blue-400">От {item.price_rub} ₽</p>
				</span>
				{/* {item.quantity_prices && item.quantity_prices.length > 1 && (
					<div className="text-xs text-gray-500">
						<ul className="list-disc pl-4">
							{item.quantity_prices.map((qp:IPrice, index:number) => (
								<li key={index} className="py-1">
									{qp.min_quantity} шт.: {qp.price_rub} ₽
								</li>
							))}
						</ul>
					</div>
				)} */}
			</div>

			{/* Габариты */}
			{/* <div className="text-xs text-gray-500 mb-2">
				Габариты: {item.dimensions.height}×{item.dimensions.width}×{item.dimensions.length} см, вес: {item.dimensions.weight} кг
			</div> */}

			{/* ID и мин. заказ (опционально, скрыть если не нужно) */}
			{/* <div className="text-xs text-gray-400">
				ID: {item.id} | Мин. заказ: {item.min_order_quantity} шт.
			</div> */}
			<div className='flex flex-col md:flex-row justify-around w-full'>
				<button
					onClick={select}
					className={`w-full flex-1 p-1 m-1 text-xs rounded ${item.selected ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'} hover:bg-opacity-80 transition-colors`}
				>
					{item.selected ? 'Выбрано' : 'Выбрать'}
				</button>
				<button
					onClick={view}
					className="w-full flex-1 p-1 m-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
				>
					Посмотреть
				</button>
			</div>
		</div>
	</div>
</div>

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


