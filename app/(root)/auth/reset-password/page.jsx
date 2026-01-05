'use client'
import OTPVerification from '@/components/Application/OTPVerification'
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
// import OTPVerification from "@/components/Application/OTPVerification"
import { useDispatch } from "react-redux"
import { login } from "@/store/reducer/authReducer"
import { otpEmail } from '@/email/otpEmail'
import UpdatePassword from '@/components/Application/UpdatePassword'

const ResetPassword = () => {

    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)    
    const [otpVerificationLoading, setOtpVerificationsetLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState()
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const formSchema = zSchema.pick({
        email: true,
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleEmailVerification = async(values) =>{
      try {
    setOtpVerificationsetLoading(true)
    console.log("Sending registration request:", values);
    const {data: sendOtpResponse} = await axios.post('/api/auth/reset-password/send-otp', values)
    
    console.log("Registration successful:", sendOtpResponse);
    setOtpEmail(values.email)
    // form.reset()
    showToast('success',sendOtpResponse.message)
    // dispatch(login(sendOtpResponse.data))
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
    setOtpVerificationsetLoading(false)
  }
    }

const handleOtpVerification = async(values) => {
    try {
        setOtpVerificationsetLoading(true)
        const requestData = {
            email: otpEmail, // Use the state value
            otp: values.otp // Assuming OTPVerification component returns otp in values
        }
        
        const {data: verifyOtpResponse} = await axios.post('/api/auth/reset-password/verify-otp', requestData)
        showToast('success', verifyOtpResponse.message)
        setIsOtpVerified(true)
    } catch (error) {
        // Error handling
    } finally {
        setOtpVerificationsetLoading(false)
    }
}

//     const handleOtpVerification = async(values) =>{
//     console.log(values);
//     try {
//     setOtpVerificationsetLoading(true)
//     console.log("Sending registration request:", values);
//     const {data: resendOtpResponse} = await axios.post('/api/auth/reset-password/verify-otp', values)
    
//     console.log("Registration successful:", resendOtpResponse);
//     // setOtpEmail('')
//     // form.reset()
//     showToast('success',resendOtpResponse.message)
//     setIsOtpVerified(true)
//     // dispatch(login(resendOtpResponse.data))
//   } catch (error) {
//     console.log("Registration error:", error);
    
//     if (error.response) {
//       // The server responded with an error status
//       console.log("Error response data:", error.response.data);
//       showToast('error',error.response.data.message || "Registration failed")
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.log("No response received:", error.request);
//       alert("Network error. Please check your connection.")
//     } else {
//       // Something happened in setting up the request
//       console.log("Request setup error:", error.message);
//       alert(error.message || "An error occurred")
//     }
//   }
//   finally{
//     setOtpVerificationsetLoading(false)
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

            {!otpEmail
                ?
              <>
                <div className='text-center'>
                <h1 className='text-2xl font-bold'>Reset your Password</h1>
                <p>Enter your Email for password below</p>
            </div>
            <div className="mt-3">
                      <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailVerification)}>
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
                
                <div>
                  <ButtonLoading loading={emailVerificationLoading} type='submit' text='Send OTP' className='w-full cursor-pointer'/>
                </div>
                  <div className="text-center mt-3">
                    
                    <Link href={WEBSITE_ROUTE.LOGIN} className="text-primary underline">Back to Login</Link>
                  
                </div>
              </form>
            </Form>
            </div>
          </>
          :
          <>
              {/* {!isOtpVerified ?
              <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification}/>
              :
              <UpdatePassword email={otpEmail}/>
              } */}
              {isOtpVerified ?
                <UpdatePassword email={otpEmail} />
                :
                <OTPVerification email={otpEmail} loading={otpVerificationLoading} onSubmit={handleOtpVerification}/>
}
          </>
      } 
            
        </CardContent>
    </Card>
  )
}

export default ResetPassword