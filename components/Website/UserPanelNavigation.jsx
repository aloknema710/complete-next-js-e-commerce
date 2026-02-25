'use client'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { showToast } from '@/lib/showToast'
import { logout } from '@/store/reducer/authReducer'

const UserPanelNavigation = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async() =>{
        try {
            const {data: logoutResponse} = await axios.post('/api/auth/logout')
            if(!logoutResponse.success){
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast('success',logoutResponse.message)
            router.push(WEBSITE_ROUTE.LOGIN)
        } catch (error) {
            showToast('error',error.message)
        }
    }
  return (
    <div className='border shadow-sm p-4 rounded'>
        <ul>
            <li className='mb-2'>
                <Link href={WEBSITE_ROUTE.USER_DASHBOARD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white
                     ${pathname.startsWith(WEBSITE_ROUTE.USER_DASHBOARD) ? 'bg-primary text-white' : ''}`}>Dashboard</Link>
            </li>
            <li className='mb-2'>
                <Link href={WEBSITE_ROUTE.USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white
                     ${pathname.startsWith(WEBSITE_ROUTE.USER_PROFILE) ? 'bg-primary text-white' : ''}`}>Profile</Link>
            </li>
            <li className='mb-2'>
                <Link href={WEBSITE_ROUTE.USER_ORDERS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white
                     ${pathname.startsWith(WEBSITE_ROUTE.USER_ORDERS) ? 'bg-primary text-white' : ''}`}>Orders</Link>
            </li>
            <li className='mb-2'>
                <Button type='button' onClick={handleLogout} variant="destructive" className={'w-full'}>Logout</Button>
            </li>
        </ul>
    </div>
  )
}

export default UserPanelNavigation