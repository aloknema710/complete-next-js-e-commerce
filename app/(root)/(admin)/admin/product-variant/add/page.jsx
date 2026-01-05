'use client'
import React, { useEffect, useState } from 'react'
import { ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD } from '@/routes/AdminPanelRoute'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQueryClient } from '@tanstack/react-query'
import { Input } from "@/components/ui/input";
import { zSchema } from '@/lib/zodSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@/lib/showToast';
import Image from 'next/image';
import ButtonLoading from '@/components/Application/ButtonLoading';
import slugify from 'slugify';
import axios from 'axios';
import useFetch from '@/hooks/useFetch';
import Select from '@/components/Application/Select';
import Editor from '@/components/Admin/Editor';
import MediaModel from '@/components/Admin/MediaModel';
import { sizes } from '@/lib/utils';

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_PRODUCT_VARIANT_ADD, label: 'Product Variant'},
    { href: '', label: 'Add Product Variant'}
]

const AddProduct = () => {
    const [loading, setLoading] = useState(false)
    const [productOption, setProductOption] = useState([])
    const {data: getProduct} = useFetch('/api/product?deleteType=SD&&size=10000')
    // console.log(getProduct)

    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(()=>{
        if(getProduct && getProduct.success){
            const data = getProduct.data
            const options = data.map((product) => ({label: product.name, value: product._id}))
            console.log(options )
            setProductOption(options)
        }
    },[getProduct])

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ['MediaModel'],
            queryFn: () => axios.get('/api/media?page=0&limit=18&deleteType=SD')
        })
    }, [queryClient])

    const formSchema = zSchema.pick({
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          product:'',
          sku:'',
          color:'',
          size:'',
          mrp:'',
          sellingPrice:'',
          discountPercentage:'',
        //   description:''
        },
      });

    // useEffect(()=>{
    //     const name = form.getValues('name')
    //     if(name){
    //       form.setValue('slug',slugify(name).toLowerCase())
    //     }
    // },[form.watch('name')])

    useEffect(()=>{
        const mrp = form.getValues('mrp') || 0
        const sellingPrice = form.getValues('sellingPrice') || 0
        if(mrp>0 && sellingPrice>0){
            const discount = ((mrp - sellingPrice)/mrp)*100
            form.setValue('discountPercentage', discount.toFixed(2))
        }else{
            form.setValue('discountPercentage', 0)
        }
    },[form.watch('mrp'), form.watch('sellingPrice')])

    // const editor = (event, editor) =>{
    //     const data = editor.getData()
    //     form.setValue('description', data)
    // }

    const onSubmit = async(values) =>{
      setLoading(true)
      try {
        if(selectedMedia.length<=0) return showToast('error','Please select atleast one media for the product')
        const mediaIds = selectedMedia.map(media => media._id)
        values.media = mediaIds

        const{data: response} = await axios.post('/api/product-variant/create', values)
        if(!response.success) throw new Error(response.message);
        form.reset()
        showToast('success', response.message)
      } catch (error) {
        showToast(error)
      }finally{
        setLoading(false)
      }
    }

  return (
    <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className=" font-semibold text-xl">Add Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Product</FormLabel>
                            <FormControl>
                                <Select
                                    options={productOption || []}
                                    selected={field.value}
                                    setSelected={field.onChange}
                                    isMulti={false}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter SKU"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter Color"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Size</FormLabel>
                            <FormControl>
                                <Select
                                    options={sizes}
                                    selected={field.value}
                                    setSelected={field.onChange}
                                    isMulti={false}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="mrp"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>MRP</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                placeholder="Enter MRP"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Selling Price</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                placeholder="Enter Selling Price"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount Percentage</FormLabel>
                            <FormControl>
                                <Input
                                readOnly
                                type="number"
                                placeholder="Enter Discount Percentage"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                </div>
                    <div className=' md:col-span-2 border border-dashed rounded p-5 text-center'>
                        <MediaModel
                            open={open}
                            setOpen={setOpen}
                            selectedMedia={selectedMedia}
                            setSelectedMedia={setSelectedMedia}
                            isMultiple={true}
                        />
                        {selectedMedia.length>0 &&
                            <div className='flex justify-center items-center flex-wrap mb-3 gap-2'>
                                {selectedMedia.map(media =>(
                                    <div key={media._id} className='h-24 w-24 border'>
                                        <Image 
                                            src={media.url || media.secure_url}
                                            alt={media.alt || ''}
                                            width={100}
                                            height={100}
                                            className='object-cover size-full'
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                        <div onClick={()=>setOpen(true)} className='bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer'>
                            <span className=' font-semibold'>Select Media</span>
                        </div>
                    </div>
                    <div className="mb-3 mt-5">
                        <ButtonLoading
                        loading={loading}
                        type="submit"
                        text="Add Product Variant"
                        ></ButtonLoading>
                    </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddProduct