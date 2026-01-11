'use client'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Checkbox } from '../ui/checkbox'
import { Slider } from '../ui/slider'
import ButtonLoading from '../Application/ButtonLoading'
import { useRouter, useSearchParams } from 'next/navigation'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import { Button } from '../ui/button'

const Filter = () => {
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedSize, setSelectedSize] = useState([])

    const router = useRouter()
    const {data: categoryData} = useFetch('/api/category/get-category')
    // console.log(categoryData)
    const {data: colorData} = useFetch('/api/product-variant/colors')
    console.log(colorData)
    const {data: sizeData} = useFetch('/api/product-variant/size')
    // console.log(sizeData)
    const [priceFilter, setPriceFilter] = useState({minPrice: 0, maxPrice: 3000})

    const urlSearchParams = new URLSearchParams(searchParams.toString())

    useEffect(()=>{
        searchParams.get('category') ? setSelectedCategory(searchParams.get('category').split(',')) : setSelectedCategory([])

        searchParams.get('color') ? setSelectedColor(searchParams.get('color').split(',')) : setSelectedColor([])
        
        searchParams.get('size') ? setSelectedSize(searchParams.get('size').split(',')) : setSelectedSize([])
    },[searchParams])

    const handlePriceChange = (value)=>{
        setPriceFilter({minPrice: value[0], maxPrice: value[1]})
    }

    const handleCategoryFilter = (categorySlug) =>{
        let newSelectedCategory = [...selectedCategory]
        if(newSelectedCategory.includes(categorySlug)){
            newSelectedCategory = newSelectedCategory.filter(cat=>cat!==categorySlug)
        }else{
            newSelectedCategory.push(categorySlug)
        }
        setSelectedCategory(newSelectedCategory)

        newSelectedCategory.length > 0 ? urlSearchParams.set('category', newSelectedCategory.join(','))
        :
        urlSearchParams.delete('category')
        router.push(`${WEBSITE_ROUTE.SHOP}?${urlSearchParams}`)
    }

    const handleColorFilter = (color) =>{
        let newSelectedColor = [...selectedColor]
        if(newSelectedColor.includes(color)){
            newSelectedColor = newSelectedColor.filter(cat=>cat!==color)
        }else{
            newSelectedColor.push(color)
        }
        setSelectedColor(newSelectedColor)

        newSelectedColor.length > 0 ? urlSearchParams.set('color', newSelectedColor.join(','))
        :
        urlSearchParams.delete('color')
        router.push(`${WEBSITE_ROUTE.SHOP}?${urlSearchParams}`)
    }

    const handleSizeFilter = (size) =>{
        let newSelectedSize = [...selectedCategory]
        if(newSelectedSize.includes(size)){
            newSelectedSize = newSelectedSize.filter(cat=>cat!==size)
        }else{
            newSelectedSize.push(size)
        }
        setSelectedCategory(newSelectedSize)

        newSelectedSize.length > 0 ? urlSearchParams.set('size', newSelectedSize.join(','))
        :
        urlSearchParams.delete('size')
        router.push(`${WEBSITE_ROUTE.SHOP}?${urlSearchParams}`)
    }

    const handlePriceFilter = () =>{
        urlSearchParams.set('minPrice', priceFilter.minPrice)
        urlSearchParams.set('maxPrice', priceFilter.maxPrice)
        router.push(`${WEBSITE_ROUTE.SHOP}?${urlSearchParams}`)
    }

  return (
    <div>
        {searchParams.size > 0 &&
            <Button asChild type='button' variant="destructive" className='w-full'>
                <Link href={WEBSITE_ROUTE.SHOP}>Clear Filter</Link>
            </Button>
        }
        <Accordion type='multiple' defaultValue={['1','2','3','4']}>
            <AccordionItem value={'1'}>
                <AccordionTrigger className={'uppercase font-semibold hover:underline'}>Category</AccordionTrigger>
                <AccordionContent>
                    <div className='max-h-48 '>
                        <ul>
                            {categoryData && categoryData.success && categoryData.data.map((category)=>(
                                <li key={category._id} className=' mb-3'>
                                    <label htmlFor="" className=' flex items-center space-x-3 cursor-pointer'>
                                        <Checkbox onCheckedChange={()=>handleCategoryFilter(category.slug)}
                                            checked={selectedCategory.includes(category.slug)}/>
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
                                        <Checkbox onCheckedChange={()=>handleColorFilter(color)}
                                            checked={selectedColor.includes(color)}/>
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
                                        <Checkbox onCheckedChange={()=>handleSizeFilter(size)}
                                            checked={selectedSize.includes(size)}/>
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
                    <ButtonLoading onClick={handlePriceFilter} type="button" text='Filter Price' className={'rounded-full mt-3'}/>
                </AccordionContent>
            </AccordionItem>
            
            
        </Accordion>
    </div>
  )
}

export default Filter