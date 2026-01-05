'use client'
import React, { use, useEffect, useState } from 'react'
import { ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
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

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_PRODUCT_SHOW, label: 'Products'},
    { href: '', label: 'Edit Product'}
]

const EditProduct = ({ params }) => {
    const { id } = use(params)
    const [loading, setLoading] = useState(false)
    const [categoryOption, setCategoryOption] = useState([])
    const {data: getCategory} = useFetch('/api/category?deleteType=SD&&size=10000')
    console.log(getCategory)

    const {data: getProduct, loading: getProductLoading} = useFetch(`/api/product/get/${id}`)
    console.log(getProduct)

    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([])

    useEffect(()=>{
        if(getCategory && getCategory.success){
            const data = getCategory.data
            const options = data.map((cat) => ({label: cat.name, value: cat._id}))
            console.log(options )
            setCategoryOption(options)
        }
    },[getCategory])

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ['MediaModel'],
            queryFn: () => axios.get('/api/media?page=0&limit=18&deleteType=SD')
        })
    }, [queryClient])

    const formSchema = zSchema.pick({
        _id: true,
        name: true,
        slug: true,
        category: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        description: true
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          _id: id,
          name:'',
          slug:'',
          category:'',
          mrp:'',
          sellingPrice:'',
          discountPercentage:'',
          description:''
        },
      });
    
    useEffect(()=>{
      if(getProduct && getProduct.success){
        const product = getProduct.data
        form.reset({
          _id: product?._id,
          name: product?.name,
          slug: product?.slug,
          category: product?.category,
          mrp: product?.mrp,
          sellingPrice: product?.sellingPrice,
          discountPercentage: product?.discountPercentage,
          description: product?.description
        })
        if(product.media){
          const media = product.media.map((media) => ({_id:media._id, url: media.secure_url}))
          setSelectedMedia(media)
        }
      }
    },[getProduct])

    useEffect(()=>{
        const name = form.getValues('name')
        if(name){
          form.setValue('slug',slugify(name).toLowerCase())
        }
    },[form.watch('name')])

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

    const editor = (event, editor) =>{
        const data = editor.getData()
        form.setValue('description', data)
    }

    const onSubmit = async(values) =>{
      setLoading(true)
      try {
        if(selectedMedia.length<=0) return showToast('error','Please select atleast one media for the product')
        const mediaIds = selectedMedia.map(media => media._id)
        values.media = mediaIds

        const{data: response} = await axios.put('/api/product/update', values)
        if(!response.success) throw new Error(response.message);
        // form.reset()
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
          <h4 className=" font-semibold text-xl">Edit Product</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid md:grid-cols-2 gap-5'>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter Category Name"
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
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter Category Slug"
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
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                    options={categoryOption}
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
                    <div className="mb-5 md:col-span-2">
                            <FormLabel className={'mb-3'}>Description <span className='text-red-500'>*</span></FormLabel>
                              {!getProductLoading &&
                                <Editor
                                    onChange={editor}
                                    initialData={form.getValues('description')}
                                />
                              }
                            
                            <FormMessage></FormMessage>
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
                        text="Save Product"
                        ></ButtonLoading>
                    </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditProduct