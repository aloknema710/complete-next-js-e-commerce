'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import { Button } from '../ui/button'
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminSidebarMenu } from '@/lib/adminSidebarMenu'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import Link from 'next/link'

const AppSidebar = () => {
    const { toggleSidebar } = useSidebar()
  return (
    <Sidebar className='z-50'>
      <SidebarHeader className=' border-b h-14 p-0'>
        <div className=' flex justify-between items-center px-4'>
            <Image src={logoBlack.src} height={50} width={logoBlack.width} className='block dark:hidden h-[50px] w-auto' alt='logo dark'/> 
            <Image src={logoWhite.src} height={50} width={logoWhite.width} className='hidden dark:block h-[50px] w-auto' alt='logo white'/>
            <Button onClick={toggleSidebar} type='button' size='icon' className=''>
                <IoMdClose/>
            </Button> 
        </div>  
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {adminSidebarMenu.map((menu, index) =>(
                <Collapsible key={index} className='group/collapsible'> 
                    <SidebarMenuItem className=' font-semibold px-2 py-5'>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton asChild>
                                <Link href={menu?.url}>
                                    <menu.icon />
                                    <span>{menu?.title}</span>
                                    {menu.submenu && menu.submenu.length > 0 &&
                                        <LuChevronRight className=' ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'/>
                                    }
                                </Link>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        {menu.submenu && menu.submenu.length > 0 && 
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {menu.submenu.map((submenuItem, submenuIndex) =>(
                                        <SidebarMenuSubItem key={submenuIndex}>
                                            <SidebarMenuSubButton asChild className='px-2 py-5'>
                                                <Link href={submenuItem.url} passHref>
                                                    <span>{submenuItem?.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        }

                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar