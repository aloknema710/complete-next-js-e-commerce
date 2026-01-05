'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import { BsChatQuote } from 'react-icons/bs'
import { IoStar } from 'react-icons/io5'

const testimonialData = [
  {
    "name": "Alex Johnson",
    "review": "Great experience overall. The service was fast and easy to use.",
    "rating": 5
  },
  {
    "name": "Maria Lopez",
    "review": "Everything worked as expected and the support was helpful.",
    "rating": 4
  },
  {
    "name": "Ethan Williams",
    "review": "Good quality, but there is still some room for improvement.",
    "rating": 4
  },
  {
    "name": "Sophia Chen",
    "review": "I found this very useful and would recommend it to others.",
    "rating": 5
  },
  {
    "name": "Daniel Smith",
    "review": "Decent experience, though a few features were confusing at first.",
    "rating": 3
  },
  {
    "name": "Aisha Khan",
    "review": "Clean design and simple to use. I’m happy with the results.",
    "rating": 5
  },
  {
    "name": "Lucas Brown",
    "review": "It does the job well, but performance could be a bit faster.",
    "rating": 4
  },
  {
    "name": "Emma Davis",
    "review": "Nice concept and easy setup. I enjoyed using it.",
    "rating": 4
  },
  {
    "name": "Noah Miller",
    "review": "Average overall. It works, but it didn’t stand out to me.",
    "rating": 3
  },
  {
    "name": "Olivia Wilson",
    "review": "Excellent quality and very reliable. I would use it again.",
    "rating": 5
  }
]


const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
})

const Testimonial = () => {
    const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,

    responsive:[
      {
        breakpoint: 1024,
        settings:{
            slidesToShow: 3,
            slidesToScroll:1,
          dots: false,
          arrows: true,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings:{
            slidesToShow: 1,
            slidesToScroll:1,
          dots: false,
          arrows: true,
          infinite: true,
        }
      },
    ]
  }
  return (
      <div style={{ width: '100%' }} className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
        <h2 className=' text-center sm:text-4xl text-2xl mb-5 font-semibold'>Customer Review</h2>
        <Slider {...settings}>
            {
                testimonialData.map((item, index)=>(
                    <div key={index} className='p-5'>
                        <div className=' border rounded-lg p-5'>
                        
                        <BsChatQuote size={30} className=' mb-3'/>
                        <p className=' mb-5'>{item.review}</p>
                        <h4 className=' font-semibold'>{item.name}</h4>
                        <div className='flex mt-2'>
                            {Array.from({length: item.rating}).map((_,i) => (
                                <IoStar key={`star${i}`} className=' text-yellow-300' size={20}/>
                            ))}
                        </div>

                        </div>
                        
                    </div>
                ))
            }
        </Slider>
      </div>
    )
}

export default Testimonial