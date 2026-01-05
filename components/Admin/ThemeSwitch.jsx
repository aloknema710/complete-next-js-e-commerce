'use client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
    const { setTheme } = useTheme()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className='cursor-pointer' type='button' variant='ghost'>
                <IoSunnyOutline className=' dark:hidden' />
                <IoMoonOutline className='hidden dark:block' />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitch