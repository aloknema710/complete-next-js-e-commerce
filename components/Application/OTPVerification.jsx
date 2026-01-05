import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import ButtonLoading from './ButtonLoading'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

const OTPVerification = ({email, onSubmit, loading}) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false)
    const formschema = zSchema.pick({
        otp:true, email:true
    })
    const form = useForm({
        resolver: zodResolver(formschema),
        defaultValues:{
            otp:"",
            email: email
        }
    })
    const handleOtpVerification = async(values) =>{
        onSubmit(values)
    }

    const resendOTP = async() =>{
        try {
    setIsResendingOtp(true)
    // console.log("Sending registration request:", values);
    const {data: registerResponse} = await axios.post('/api/auth/resend-otp', 
        { email }
)
    
    showToast('success',registerResponse.message)
    
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
    setIsResendingOtp(false)
  }
    }

  return (
    <div>
        <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOtpVerification)}>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold mb-2'>Please Complete Verification</h1>
                    <p>We have sent an one time password(otp) to your email id</p>
                </div>
                <div className="mb-5 mt-5 flex justify-center">
                  <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold'>One Time Password</FormLabel>
                      <FormControl>
                            <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                                <InputOTPSlot className=' text-xl size-10' index={0} />
                                <InputOTPSlot className=' text-xl size-10' index={1} />
                                <InputOTPSlot className=' text-xl size-10' index={2} />
                                <InputOTPSlot className=' text-xl size-10' index={3} />
                                <InputOTPSlot className=' text-xl size-10' index={4} />
                                <InputOTPSlot className=' text-xl size-10' index={5} />
                            </InputOTPGroup>
                            </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                
                <div>
                  <ButtonLoading loading={loading} type='submit' text='Login' className='w-full cursor-pointer'/>
                  <div className=' text-center mt-5'>
                    {!isResendingOtp ?
                        <button onClick={resendOTP} type='button' className=' text-blue-500 cursor-pointer hover:underline'>Resend OTP</button>    
                        :
                        <span className='text-md'>Resending...</span>
                    }
                    
                  </div>
                </div>
                  
              </form>
            </Form>
    </div>
  )
}

export default OTPVerification