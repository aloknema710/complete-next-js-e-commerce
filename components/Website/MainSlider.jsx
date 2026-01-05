// 'use client'
// import React from 'react'
// import Slider from "react-slick";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// import Image from 'next/image';

// import slider1 from '@/public/assets/images/slider-1.png'
// import slider2 from '@/public/assets/images/slider-2.png'
// import slider3 from '@/public/assets/images/slider-3.png'
// import slider4 from '@/public/assets/images/slider-4.png'

// const MainSlider = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//   };

//   return (
//     <div className="w-full">
//       <Slider {...settings}>
//         <div><Image src={slider1} alt="slider 1" /></div>
//         <div><Image src={slider2} alt="slider 2" /></div>
//         <div><Image src={slider3} alt="slider 3" /></div>
//         <div><Image src={slider4} alt="slider 4" /></div>
//       </Slider>
//     </div>
//   )
// }

// export default MainSlider

'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import slider1 from '@/public/assets/images/slider-1.png'
import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const ArrowNext =(props) =>{
  const {onClick} = props
  return(
    <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-2 md:right-10'>
        <LuChevronRight size={25} className='text-gray-600'/>
    </button>
  )
}

const ArrowPrev =(props) =>{
  const {onClick} = props
  return(
    <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-2 md:left-10'>
        <LuChevronLeft size={25} className='text-gray-600'/>
    </button>
  )
}

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
})

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,

    responsive:[
      {
        breakpoint: 480,
        settings:{
          dots: false,
          arrows: true,
          nextArrow: <ArrowNext />,
          prevArrow: <ArrowPrev />,
        }
      }
    ]
  }

  return (
    <div style={{ width: '100%' }}>
      <Slider {...settings}>
        <div><Image src={slider1} alt="slider 1" /></div>
        <div><Image src={slider2} alt="slider 2" /></div>
        <div><Image src={slider3} alt="slider 3" /></div>
        <div><Image src={slider4} alt="slider 4" /></div>
      </Slider>
    </div>
  )
}

export default MainSlider
