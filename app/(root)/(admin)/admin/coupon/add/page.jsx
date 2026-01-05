'use client'
import React, { useEffect, useState } from 'react'
import { ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_COUPON_ADD, ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from '@/routes/AdminPanelRoute'
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
import ButtonLoading from '@/components/Application/ButtonLoading';
import axios from 'axios';


const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: ADMIN_COUPON_ADD, label: 'Coupons'},
    { href: '', label: 'Add Coupon'}
]

const AddCoupon = () => {
    const [loading, setLoading] = useState(false)
    
    const formSchema = zSchema.pick({
        code: true,
        discountPercentage: true,
        minShoppingAmount: true,
        validity: true
      });
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          code: '',
          discountPercentage: '',
          minShoppingAmount: '',
          validity: ''
        },
      });

    const onSubmit = async(values) =>{
      setLoading(true)
      try {
        const{data: response} = await axios.post('/api/coupon/create', values)
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
          <h4 className=" font-semibold text-xl">Add Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                type="text"
                                placeholder="Enter Code"
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
                    <div className="mb-5">
                        <FormField
                        control={form.control}
                        name="minShoppingAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Minimum Shopping Amount</FormLabel>
                            <FormControl>
                                <Input
                                
                                type="number"
                                placeholder="Enter Min. Shopping Amount"
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
                        name="validity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Validity</FormLabel>
                            <FormControl>
                                <Input
                                type="date"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    
                </div>
                    
                    <div className="mb-3 mt-5">
                        <ButtonLoading
                        loading={loading}
                        type="submit"
                        text="Add Coupon"
                        ></ButtonLoading>
                    </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCoupon