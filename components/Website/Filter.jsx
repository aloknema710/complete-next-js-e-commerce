'use client'
import useFetch from '@/hooks/useFetch'
import React, { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Checkbox } from '../ui/checkbox'
import { Slider } from '../ui/slider'
import ButtonLoading from '../Application/ButtonLoading'
import { useSearchParams } from 'next/navigation'

const Filter = () => {
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState([])
    const [color, setColor] = useState([])
    const [size, setSize] = useState([])

    const {data: categoryData} = useFetch('/api/category/get-category')
    // console.log(categoryData)
    const {data: colorData} = useFetch('/api/product-variant/colors')
    console.log(colorData)
    const {data: sizeData} = useFetch('/api/product-variant/size')
    // console.log(sizeData)
    const [priceFilter, setPriceFilter] = useState({minPrice: 0, maxPrice: 3000})

    const handlePriceChange = (value)=>{
        setPriceFilter({minPrice: value[0], maxPrice: value[1]})
    }

    const handleCategoryFilter = (categorySlug) =>{
        let newSelectedCategory = [...selectedCategory]
    }

  return (
    <div>
        <Accordion type='multiple' defaultValue={['1','2','3','4']}>
            <AccordionItem value={'1'}>
                <AccordionTrigger className={'uppercase font-semibold hover:underline'}>Category</AccordionTrigger>
                <AccordionContent>
                    <div className='max-h-48 '>
                        <ul>
                            {categoryData && categoryData.success && categoryData.data.map((category)=>(
                                <li key={category._id} className=' mb-3'>
                                    <label htmlFor="" className=' flex items-center space-x-3 cursor-pointer'>
                                        <Checkbox/>
                                        <span>{category.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value={'2'}>
                <AccordionTrigger className={'uppercase font-semibold hover:underline'}>Colors</AccordionTrigger>
                <AccordionContent>
                    <div className='max-h-48 '>
                        <ul>
                            {colorData && colorData.success && colorData.data.map((color)=>(
                                <li key={color} className=' mb-3'>
                                    <label htmlFor="" className=' flex items-center space-x-3 cursor-pointer'>
                                        <Checkbox/>
                                        <span className=''>{color}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value={'3'}>
                <AccordionTrigger className={'uppercase font-semibold hover:underline'}>Size</AccordionTrigger>
                <AccordionContent>
                    <div className='max-h-48 '>
                        <ul>
                            {sizeData && sizeData.success && sizeData.data.map((size)=>(
                                <li key={size} className=' mb-3'>
                                    <label htmlFor="" className=' flex items-center space-x-3 cursor-pointer'>
                                        <Checkbox/>
                                        <span>{size}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value={'4'}>
                <AccordionTrigger className={'uppercase font-semibold hover:underline'}>Price Range</AccordionTrigger>
                <AccordionContent>
                    <Slider className={'mt-2'} defaultValue={[0,3000]} max={3000} step={1} onValueChange={handlePriceChange}/>
                    <div className=' flex justify-between items-center p-2'>
                        <span>{priceFilter.minPrice.toLocaleString('en-IN', {style:'currency', currency: 'INR'})}</span>
                        <span>{priceFilter.maxPrice.toLocaleString('en-IN', {style:'currency', currency: 'INR'})}</span>
                    </div>
                    <ButtonLoading type="button" text='Filter Price' className={'rounded-full mt-3'}/>
                </AccordionContent>
            </AccordionItem>
            
            
        </Accordion>
    </div>
  )
}

export default Filter