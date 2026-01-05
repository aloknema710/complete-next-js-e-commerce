'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zSchema } from "@/lib/zodSchema"
import axios from "axios"

// import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import ButtonLoading from "@/components/Application/ButtonLoading"
import z from "zod"
import {FaRegEyeSlash} from 'react-icons/fa'
import { FaRegEye } from 'react-icons/fa6'
import Link from "next/link"
import { WEBSITE_ROUTE } from "@/routes/WebsiteRoute"
import { showToast } from "@/lib/showToast"
const RegisterPage = () => {

    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const formSchema = zSchema.pick({
        name: true,
        email: true,
        password: true,
    }).extend({
        confirmPassword: z.string()
        // password: z.string().min('6', "Password must be at least 6 characters long")
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords and confirm password must be same",
        path: ["confirmPassword"],
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

   const handleRegisterSubmit = async(values) =>{
  try {
    setLoading(true)
    console.log("Sending registration request:", values);
    const {data: registerResponse} = await axios.post('/api/auth/register', values)
    
    console.log("Registration successful:", registerResponse);
    form.reset()
    // alert(registerResponse.message)
    showToast('success', registerResponse.message)
    
  } catch (error) {
    console.log("Registration error:", error);
    
    if (error.response) {
      // The server responded with an error status
      console.log("Error response data:", error.response.data);
      // alert(error.response.data.message || "Registration failed")
      showToast('error', registerResponse.message) 
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received:", error.request);
      alert("Network error. Please check your connection.")
    } else {
      // Something happened in setting up the request
      console.log("Request setup error:", error.message);
      alert(error.message || "An error occurred")
    }
  }
  finally{
    setLoading(false)
  }
}

    // const handleRegisterSubmit = async(values) =>{
    //   // console.log("Login Values: ", values)
    //   try {
    //     setLoading(true)
    //     const {data: registerResponse} = await axios.post('/api/auth/register', values)
    //     if(!registerResponse.success){
    //       throw new Error(registerResponse.message)
    //     }
    //     form.reset()
    //     alert(registerResponse.message)
    //   } catch (error) {
    //     alert(error.message)
    //   }
    //   finally{
    //     setLoading(false)
    //   }
    // }

  return (
    <Card className='w-[400px]'>
        <CardContent>
            <div className='flex justify-center'>
                <Image src={Logo.src} width={Logo.width} height={Logo.height}
                    className='max-w-[150px]' alt=''>
                </Image>
            </div>
            <div className='text-center'>
                <h1 className='text-2xl font-bold'>Create your Account</h1>
                <p>Create your new Account by filling out the form below.</p>
            </div>
            <div className="mt-3">
                      <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder="Coder123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder="Coder123@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type='password'
                        placeholder="*********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={isTypePassword ? 'password' : 'text'} 
                        placeholder="*********" {...field} />
                      </FormControl>
                      <button type="button" className="absolute right-2 top-1/2 cursor-pointer text-gray-500"
                        onClick={() => setIsTypePassword(!isTypePassword)}>
                          {isTypePassword ? 
                            <FaRegEyeSlash />
                            : 
                            <FaRegEye /> }
                        </button>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                  <ButtonLoading loading={loading} type='submit' text='Create Account' className='w-full cursor-pointer'/>
                </div>
                  <div className="text-center mt-3">
                    <p>Already have an account?</p>
                    <Link href={WEBSITE_ROUTE.LOGIN} className="text-primary underline">Login!</Link>
                </div>
              </form>
            </Form>
            </div>
        </CardContent>
    </Card>
  )
}
export default RegisterPage