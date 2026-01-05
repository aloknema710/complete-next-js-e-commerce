import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { MdOutlineShoppingBag } from 'react-icons/md'
import { IoShirtOutline } from 'react-icons/io5'
import LogoutButton from './LogoutButton'

const UserDropdown = () => {
    const auth = useSelector((store) => store.authStore.auth)
    console.log("Auth from Redux:", auth);

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p className='font-semibold'>{auth?.data?.name || 'Guest'}</p>
            {/* <span className=' font-normal text-sm line-clamp-1'>{auth?.email}</span> */}
          </DropdownMenuLabel>
          {/* Add more dropdown items here if needed */}
          <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
                <Link href='' className=' cursor-pointer'><IoShirtOutline/> New product</Link>
             </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href='' className=' cursor-pointer'><MdOutlineShoppingBag/> Orders</Link>
             </DropdownMenuItem>
             <LogoutButton/>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown