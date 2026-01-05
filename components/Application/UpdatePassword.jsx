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
import { useRouter } from "next/navigation"
// const UpdatePassword = ({email}) => {
//     const router = useRouter()
//     const [loading, setLoading] = useState(false)
//     const [isTypePassword, setIsTypePassword] = useState(true)
//     const formSchema = zSchema.pick({
//         email: true, password: true,
//     }).extend({
//         confirmPassword: z.string()
//         // password: z.string().min('6', "Password must be at least 6 characters long")
//     }).refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords and confirm password must be same",
//         path: ["confirmPassword"],
//     })

//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: email,
//             password: "",
//             confirmPassword: "",
//         },
//     })

//    const handlePasswordUpdate = async(values) =>{
//   try {
//     setLoading(true)
//     console.log("Sending registration request:", values);
//     const {data: passwordUpdate} = await axios.post('/api/auth/reset-password/update-password', values)
    
//     console.log("Registration successful:", passwordUpdate);
//     form.reset()
//     // alert(registerResponse.message)
//     showToast('success', passwordUpdate.message)
//     router.push(WEBSITE_ROUTE.LOGIN)
//   } catch (error) {
//     console.log("Registration error:", error);
    
//     if (error.response) {
//       // The server responded with an error status
//       console.log("Error response data:", error.response.data);
//       // alert(error.response.data.message || "Registration failed")
//       showToast('error', passwordUpdate.message) 
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
//     setLoading(false)
//   }
// }

//     // const handleRegisterSubmit = async(values) =>{
//     //   // console.log("Login Values: ", values)
//     //   try {
//     //     setLoading(true)
//     //     const {data: registerResponse} = await axios.post('/api/auth/register', values)
//     //     if(!registerResponse.success){
//     //       throw new Error(registerResponse.message)
//     //     }
//     //     form.reset()
//     //     alert(registerResponse.message)
//     //   } catch (error) {
//     //     alert(error.message)
//     //   }
//     //   finally{
//     //     setLoading(false)
//     //   }
//     // }

//   return (
//     <Card className='w-[400px]'>
//         <CardContent>
            
//             <div className='text-center'>
//                 <h1 className='text-2xl font-bold'>Update Password</h1>
//                 <p>Create new password by filling below form.</p>
//             </div>
//             <div className="mt-3">
//                       <Form {...form}>
//             <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
                
                
//                 <div>
//                 <div className="mb-5">
//                   <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem className='relative'>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl>
//                         <Input type='password'
//                         placeholder="*********" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 </div>
//                 <div className="mb-5">
//                   <FormField
//                   control={form.control}
//                   name="confirmPassword"
//                   render={({ field }) => (
//                     <FormItem className='relative'>
//                       <FormLabel>Confirm Password</FormLabel>
//                       <FormControl>
//                         <Input type={isTypePassword ? 'password' : 'text'} 
//                         placeholder="*********" {...field} />
//                       </FormControl>
//                       <button type="button" className="absolute right-2 top-1/2 cursor-pointer text-gray-500"
//                         onClick={() => setIsTypePassword(!isTypePassword)}>
//                           {isTypePassword ? 
//                             <FaRegEyeSlash />
//                             : 
//                             <FaRegEye /> }
//                         </button>

//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 </div>
//                   <ButtonLoading loading={loading} type='submit' text='Update Password' className='w-full cursor-pointer'/>
//                 </div>
                  
//               </form>
//             </Form>
//             </div>
//         </CardContent>
//     </Card>
//   )
// }
// export default UpdatePassword


const UpdatePassword = ({email}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isTypePassword, setIsTypePassword] = useState(true)
    
    // Only validate password fields, not email
    const formSchema = z.object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords and confirm password must be same",
        path: ["confirmPassword"],
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    // const handlePasswordUpdate = async(values) => {
    //     try {
    //         setLoading(true)
    //         // Include the email from props in the request
    //         const requestData = {
    //             email: email,
    //             password: values.password
    //         }
            
    //         console.log("Sending password update request:", requestData);
    //         const {data: passwordUpdate} = await axios.post('/api/auth/reset-password/update-password', requestData)
            
    //         console.log("Password update successful:", passwordUpdate);
    //         form.reset()
    //         showToast('success', passwordUpdate.message)
    //         router.push(WEBSITE_ROUTE.LOGIN)
    //     } catch (error) {
    //         console.log("Password update error:", error);
            
    //         if (error.response) {
    //             showToast('error', error.response.data.message || "Password update failed")
    //         } else if (error.request) {
    //             alert("Network error. Please check your connection.")
    //         } else {
    //             alert(error.message || "An error occurred")
    //         }
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handlePasswordUpdate = async(values) => {
    try {
        setLoading(true)
        const requestData = {
            email: email, // From props
            password: values.password
        }
        
        const {data: passwordUpdate} = await axios.put('/api/auth/reset-password/update-password', requestData)
        showToast('success', passwordUpdate.message)
        router.push(WEBSITE_ROUTE.LOGIN)
    } catch (error) {
        // Error handling
    } finally {
        setLoading(false)
    }
}

    return (

            <div>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold'>Update Password</h1>
                    <p>Create new password for {email}</p>
                </div>
                <div className="mt-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
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
                            <ButtonLoading loading={loading} type='submit' text='Update Password' className='w-full cursor-pointer'/>
                        </form>
                    </Form>
                </div>
            </div>
        
    )
}

export default UpdatePassword