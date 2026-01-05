'use client'
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import verifiedImg from '@/public/assets/images/verified.gif'
import verificationFailedImg from '@/public/assets/images/verification-failed.gif'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'

const EmailVerification = ({ params }) => {
  
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false)
  console.log(token)
  
  useEffect(() => {
      const verify = async() =>{
        const{ data: verificationResponse } = await axios.post('/api/auth/verify-email',{ token });
        console.log(verificationResponse);
        if(verificationResponse.success){
          setIsVerified(true)
        }
        // setIsVerified(false)
      } 
      verify()
  },[token])
  
  return (
    <Card>
      <CardContent>
        {isVerified ?
          <div>
              <div className='flex justify-center items-center'>
                <Image alt='verified' src={verifiedImg.src} height={verifiedImg.height} width={verifiedImg.width} className='h-[100px]'/>
              </div>
              <div className=' text-center'>
                <h1 className=' text-2xl font-bold text-green-500 my-5'>Email Verification Success!</h1>
                <Button>
                    <Link href={WEBSITE_ROUTE.HOME}>Continue Shopping</Link>
                </Button>
              </div>
          </div>
          :
          <div>
              <div className='flex justify-center items-center mb-4 '>
                <Image alt='not verified' src={verificationFailedImg.src} height={verificationFailedImg.height} width={verificationFailedImg.width} className='h-[100px] w-auto'/>
              </div>
              <div className=' text-center'>
                <h1 className='text-2xl font-bold my-5 text-orange-700'>Email Verification Failed!</h1>
              </div>
          </div>
        }
      </CardContent>
    </Card>
  )
}

export default EmailVerification