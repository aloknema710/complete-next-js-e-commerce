'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
import { zSchema } from "@/lib/zodSchema"

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
import axios from "axios"
import { showToast } from "@/lib/showToast"
import OTPVerification from "@/components/Application/OTPVerification"
import { useDispatch } from "react-redux"
import { login } from "@/store/reducer/authReducer"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute"

const LoginPage = () => {
    const dispatch = useDispatch()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [otpVerificationLoading, setOtpVerificationsetLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    const [otpEmail, setOtpEmail] = useState()
    const formSchema = zSchema.pick({
        email: true,
        // password: true
    }).extend({
        password: z.string().min('6', "Password must be at least 6 characters long")
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLoginSubmit = async(values) =>{
      // console.log("Login Values: ", values)
      // showToast('success', 'Toast Success')
      try {
    setLoading(true)
    console.log("Sending registration request:", values);
    const {data: loginresponse} = await axios.post('/api/auth/login', values)
    
    console.log("Registration successful:", loginresponse);
    setOtpEmail(values.email)
    form.reset()
    showToast('success',loginresponse.message)
    
  } catch (error) {
    console.log("Registration error:", error);
    
    if (error.response) {
      // The server responded with an error status
      console.log("Error response data:", error.response.data);
      showToast('error',error.response.data.message || "Registration failed")
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

const handleOtpVerification = async(values) =>{
    console.log(values);
    try {
        setOtpVerificationsetLoading(true)
        const {data: resendOtpResponse} = await axios.post('/api/auth/verify-otp', values, {
            withCredentials: true
        })
        
        console.log("Registration successful:", resendOtpResponse);
        setOtpEmail('')
        showToast('success', resendOtpResponse.message)
        dispatch(login(resendOtpResponse))

        if(searchParams.has('callback')){
            router.push(searchParams.get('callback'))
        } else {
            // FIX: Access role from data.user.role
            resendOtpResponse.data.user.role === 'admin' 
                ? router.push(ADMIN_DASHBOARD) 
                : router.push(WEBSITE_ROUTE.USER_DASHBOARD)
        }

    } catch (error) {
        console.log("Registration error:", error);
        
        if (error.response) {
            console.log("Error response data:", error.response.data);
            showToast('error', error.response.data.message || "Registration failed")
        } else if (error.request) {
            console.log("No response received:", error.request);
            alert("Network error. Please check your connection.")
        } else {
            console.log("Request setup error:", error.message);
            alert(error.message || "An error occurred")
        }
    } finally {
        setOtpVerificationsetLoading(false)
    }
}

  return (
    <Card className='w-[400px]'>
        <CardContent>
            <div className='flex justify-center'>
                <Image src={Logo.src} width={Logo.width} height={Logo.height}
                    className='max-w-[150px]' alt=''>
                </Image>
            </div>

            {!otpEmail
                ?
              <>
                <div className='text-center'>
                <h1 className='text-2xl font-bold'>Login to your Account</h1>
                <p>Login to your Account by filling out the form below.</p>
            </div>
            <div className="mt-3">
                      <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="mb-5">
                  <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className='relative'>
                      <FormLabel>Password</FormLabel>
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
                <div>
                  <ButtonLoading loading={loading} type='submit' text='Login' className='w-full cursor-pointer'/>
                </div>
                  <div className="text-center mt-3">
                    <p>Don't have an account?</p>
                    <Link href={WEBSITE_ROUTE.REGISTER} className="text-primary underline">Create Account!</Link>
                  <div>
                    <Link href={WEBSITE_ROUTE.RESETPASSWORD} className="text-primary underline">Forgot password?</Link>
                  </div>
                </div>
              </form>
            </Form>
            </div>
              </>
                :
              <>
                <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification}/>
              </>
            }

            
        </CardContent>
    </Card>
  )
}

export default LoginPage

// const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       username: "",
//     },
//   })



/**
  const handleOtpVerification = async(values) =>{
    console.log(values);
    try {
    setOtpVerificationsetLoading(true)
    console.log("Sending registration request:", values);
    const {data: resendOtpResponse} = await axios.post('/api/auth/verify-otp', values, {
      withCredentials: true
    })
    
    console.log("Registration successful:", resendOtpResponse);
    setOtpEmail('')
    // form.reset()
    showToast('success',resendOtpResponse.message)
    dispatch(login(resendOtpResponse))//.data corrected

      if(searchParams.has('callback')){
        router.push(searchParams.get('callback'))
      }else{
        resendOtpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(WEBSITE_ROUTE.USER_DASHBOARD)
      }

  }
 */