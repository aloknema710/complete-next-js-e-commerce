import AppSidebar from '@/components/Admin/AppSidebar'
import Topbar from '@/components/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const layout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
    <SidebarProvider>
        <AppSidebar/>
        <main className=' md:w-[calc(100vw-16rem)] w-full'>
          <div className='pt-[70px] md:px-8 px-5 pb-10 min-h-[calc(100vh-40px)]'>
            <Topbar/>
            {children}
          </div>
          <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
             2025 Developer. All rights reserved.
          </div>
        </main>
    </SidebarProvider>
    </ThemeProvider>
  )
}

export default layout