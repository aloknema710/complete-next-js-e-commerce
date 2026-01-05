'use client'
import React, { useEffect, useState } from 'react'
import { ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
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
import { Input } from "@/components/ui/input";
import { zSchema } from '@/lib/zodSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showToast } from '@/lib/showToast';
import Image from 'next/image';
import ButtonLoading from '@/components/Application/ButtonLoading';
import slugify from 'slugify';
import axios from 'axios';

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_CATEGORY_SHOW, label: 'Category'},
    { href: '', label: 'Add Category'}
]

const AddCategory = () => {
    const [loading, setLoading] = useState(false)
    const formSchema = zSchema.pick({
        name: true,
        slug: true
        // password: true
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name:'',
          slug:''
        },
      });

    useEffect(()=>{
        const name = form.getValues('name')
        if(name){
          form.setValue('slug',slugify(name).toLowerCase())
        }
    },[form.watch('name')])

    const onSubmit = async(values) =>{
      setLoading(true)
      try {
        const{data: response} = await axios.post('/api/category/create', values)
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
          <h4 className=" font-semibold text-xl">Add Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              
              
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
              <div className="mb-3">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Add Category"
                ></ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCategory