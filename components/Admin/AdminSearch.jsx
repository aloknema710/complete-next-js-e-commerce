import React, { useState } from 'react'
import { Input } from '../ui/input'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'

const AdminSearch = () => {
    const [open, setOpen] = useState(false)
  return (
    <div className='relative w-full'>
        <div className=' relative w-full'>
            <Input
                readOnly
                className={'rounded-full cursor-pointer pr-10'}
                placeholder="Search..."
                onClick={()=> setOpen(true)}
            />
            <button type='button' className='absolute right-3 top-2 -translate-y-0.5 text-gray-500 cursor-default'>
                <IoIosSearch/>
            </button>
        </div>
        <SearchModel open={open} setOpen={setOpen}/>
    </div>
  )
}

export default AdminSearch