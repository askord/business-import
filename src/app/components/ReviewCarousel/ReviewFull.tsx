import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface IReview{
	id: number
	icon: string
	name: string
	post: string
	content: string
}

const reviews:IReview[] = [
	{
		id:1,
		icon:"/assets/article/article-1.webp",
		name: "Алексей Чайкин",
		post:"Начальник отдела снабжения",
		content:"Работаем с этой компанией уже больше двух лет. Заказывали комплектующие для нашего производства. Особенно ценим надежность и четкое соблюдение сроков. Ни разу не подвели, даже когда требовалась срочная поставка. Менеджеры всегда на связи и готовы помочь с любыми вопросами. Рекомендую как стабильного и ответственного партнера."
	},
	{
		id:2,
		icon:"/assets/article/article-1.webp",
		name: "Елена Смирнова",
		post:"Индивидуальный предприниматель",
		content:"Для нашего интернет-магазина заказывали через них партию трендовых товаров. Боялись сложностей с поиском надежного поставщика в Китае и таможней. Ребята взяли все на себя: нашли фабрику, проверили качество образцов, организовали доставку и полное таможенное оформление. Все прошло гладко и даже быстрее, чем ожидали. Спасибо за профессионализм!"
	},
	{
		id:3,
		icon:"/assets/article/article-1.webp",
		name: "Дмитрий Тихомиров",
		post:"Технический директор",
		content:"Нам было важно найти партнера, который не просто доставит груз, но и поможет с контролем качества на производстве в Китае. Эта компания предоставила такую услугу. Их инспектор провел проверку на фабрике, прислал подробный отчет с фотографиями. В итоге мы получили именно тот товар, который заказывали, без брака. Очень довольны таким комплексным подходом."
	},
	{
		id:4,
		icon:"/assets/article/article-1.webp",
		name: "Надежда Кузнецова",
		post: "Руководитель отдела закупок",
		content: "Обратились в компанию для импорта оборудования. Задача была не самая простая, требовалась тщательная проработка логистики и документации. Команда справилась на отлично! Особенно хочу отметить оперативность в решении возникающих вопросов и прозрачность на всех этапах сделки. Цены на услуги также оказались конкурентными."
	},
	{
		id:5,
		icon:"/assets/article/article-1.webp",
		name: "Марат Тухбатуллин",
		post: "Генеральный директор",
		content: "Как владелец небольшой сети магазинов сувениров, я постоянно ищу интересные новинки. Эта компания помогает мне находить уникальные товары в Китае и организовывать сборные грузы от разных поставщиков, что очень удобно и выгодно при небольших партиях. Всегда четкая коммуникация и своевременная доставка."
	},
	{
		id:6,
		icon:"/assets/article/article-1.webp",
		name: "Валерия Новикова",
		post: "Менеджер по развитию бизнеса",
		content: `Начинали работать с Китаем впервые и искали компанию, которая проведет "за руку" через весь процесс. Выбрали этих ребят и не пожалели. Нам подробно объяснили все этапы, помогли с переговорами, документами, растаможкой. Чувствовалась реальная поддержка и заинтересованность в успехе нашего проекта. Огромная благодарность всей команде!`
	}
];

export const ReviewFull = () => {
	 const [fullscreenReview] = useState<IReview | undefined>();
	const [currentIndex, setCurrentIndex] = useState<number>(0);

	const visibleArticles = reviews.slice(currentIndex, currentIndex + 1);

  const handleNext = () => {
    if (currentIndex + 1 < reviews.length) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

	useEffect(() => {
    // Отключаем или включаем прокрутку страницы в зависимости от состояния модального окна
    if (fullscreenReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Очистка эффекта при размонтировании компонента
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullscreenReview]);

  return <>
      <section id="reviews" className="py-20 bg-gray-100 min-h-screen flex items-center">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-indigo-900 mb-12">Отзывы</h2>
          <div className="relative">
            <div className="grid md:grid-cols-1 gap-8 place-items-center">
              {visibleArticles.map((article) => (
                <div
                  key={article.id}
                  // onClick={() => setFullscreenReview(article)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden md:max-w-[600px]"
                >
                  <div className="relative flex flex-row items-center justify-start px-6 py-5">
                    <Image
                      src={article.icon}
                      alt={article.name}
                      // layout="fill"
                      // objectFit="cover"
											width={75}
											height={75}
											className='rounded-full'
                    />
										<div className="px-6">
											<h3 className="text-xl font-bold text-indigo-900 mb-2">{article.name}</h3>
											<h3 className="text font-bold text-indigo-900 mb-2">{article.post}</h3>
										</div>
                  </div>
									<div className="p-6">
                    <p className="text-gray-600">{article.content}</p>
									</div>
                </div>
              ))}
            </div>

            {/* Кнопка "Назад" */}
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
                aria-label="Предыдущие статьи"
              >
                <ArrowLeftIcon className="h-6 w-6 text-indigo-900" />
              </button>
            )}

            {/* Кнопка "Вперёд" */}
            {currentIndex + 1 < reviews.length && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-20"
                aria-label="Следующие статьи"
              >
                <ArrowRightIcon className="h-6 w-6 text-indigo-900" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Полноэкранное отображение статьи */}
      {/* {fullscreenReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 md:p-8 z-50">
          <div className="bg-white rounded-lg shadow-xl md:max-w-7/12 w-full max-h-full overflow-y-auto relative">
            <button
              onClick={() => setFullscreenReview(undefined)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 z-50 p-2"
              aria-label="Закрыть"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={fullscreenReview.icon}
                alt={fullscreenReview.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4">{fullscreenReview.name}</h1>
              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-4">{fullscreenReview.post}</h1>
              <div className="prose max-w-none text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: fullscreenReview.content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      )} */}
    </>
}
