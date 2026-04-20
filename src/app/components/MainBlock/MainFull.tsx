import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { ChatFull } from '../ChatBlock/ChatFull';
import { XMarkIcon, QuestionMarkCircleIcon} from '@heroicons/react/24/solid';

const MAIN_FULL_IMAGES:string[] = [
	'/assets/main/main-1.webp',
	'/assets/main/main-2.webp',
	'/assets/main/main-3.webp',
	'/assets/main/main-4.webp',
]

export const MainFull = () => {
	const [currentImage, setCurrentImage] = useState(0);
	const [showHelp, setShowHelp] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % MAIN_FULL_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

	useEffect(() => {
			// Отключаем или включаем прокрутку страницы в зависимости от состояния модального окна
			if (showHelp) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}

			// Очистка эффекта при размонтировании компонента
			return () => {
				document.body.style.overflow = 'auto';
			};
		}, [showHelp]);

	return <section id="main" className="relative flex flex-col md:flex-row items-center justify-center overflow-hidden min-h-screen flex items-center">
	<div className="absolute inset-0 z-0">
		{MAIN_FULL_IMAGES.map((image, index) => (
			<div
				key={image}
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
				/>
			</div>
		))}
		{/* Затемняющий оверлей для читаемости текста */}
		<div className="absolute inset-0 bg-black opacity-60"></div>
	</div>

	{/* Контент поверх карусели */}
	<div className="z-10 text-white self-center my-10 mx-2 md:max-w-[800px] md:mx-20">
		<h1 className="text-4xl text-center md:text-start md:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
			Международная торговля<br /> <span className='font-bold text-blue-500'>Инновационно</span> и <span className='font-bold text-blue-500'>Профессионально.</span>
		</h1>
		<p className="mt-4 text-xl text-center md:text-start md:text-2xl text-gray-300 drop-shadow-md">
			<span className='font-bold'>Бизнес-Import</span> - надежный партнёр с многолетним опытом работы в сфере международной торговли. Наша компания - верный выбор для поиска и импорта товаров из любой точки мира.
		</p>
		<div className='flex justify-end items-center'>
			<h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-md mt-5 text-center md:text-end">
				ИИ-консультант для поиска товар
			</h3>
			<button className='text-blue-500 cursor-pointer p-2' onClick={()=>setShowHelp(true)}>
				<QuestionMarkCircleIcon height={25}/>
			</button>
		</div>
		<ul className='text-xl text-center md:text-end'>
			<li><span className='font-extrabold'> - </span> Доступен в любое время</li>
			<li><span className='font-extrabold'> - </span> Моментальный расчёт предварительной цены</li>
			<li><span className='font-extrabold'> - </span> 10% скидка при использовании «ИИ-консультанта»</li>
		</ul>
	</div>

	<div className="z-10 text-center md:text-start text-white self-center my-10 mx-2  md:mx-20 w-full md:max-w-[600px]">
		<ChatFull />
	</div>
	{showHelp && <HelpFullScreenView close={()=>setShowHelp(false)}/>}
</section>
}

const HelpFullScreenView = ({close}:{close:()=>void}) =>
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
			<h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4 w-10/12">Просим Вас обратить внимание на следующие пункты:</h1>
			<div>
1️⃣ Внимательно формулируйте запрос на поиск. Чем точнее он будет, тем точечнее осуществиться поиск. Пример: <br />
«кроссовки Nike AirMAX97»✅ <br />
«кроссовки» ❌<br /><br />

2️⃣ Постарайтесь избегать сленговых выражений, которые система может распознать с ошибкой. Пример: <br />
«Преобразователь частоты Siemens M40 6SE6440»✅<br />
«частотник Сименс»❌<br /><br />

3️⃣ Пишите название моделей и брендов верно. Не забывай писать наименование на оригинальном языке. Пример: <br />
«одежда Adidas»✅<br />
«одежда Абибас»❌<br /><br />

4️⃣ Учитывайте, что название/модели товара в Китае может отличаться от той, которая используется в РФ. Пример: <br />
«запчасти для Geely Binyue COOL»✅<br />
«запчасти для Geely Coolray»❌<br /><br />

5️⃣ Ориентировочная стоимость товаров указана с учетом текущего курса валют, публичной информации продавца и доставки через наш сервис. После проведения переговоров цена может измениться. Указанные цены не являются публичной офертой и/или коммерческим предложением<br /><br />

6⃣ Помните, что наши менеджеры и сотрудники - обычные люди. Время, когда они могут отвечать на Ваши вопросы - с 8:00 до 20:00, в будние дни. Спасибо за понимание<br /><br />

Продолжая использования нашего бота, Вы подтверждаете, что ознакомились и согласны с вышеуказанными пунктами<br />

Приятного поиска!
			</div>
		</div>
	</div>
</div>