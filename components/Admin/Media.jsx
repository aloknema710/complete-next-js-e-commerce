import React from 'react'
import { Checkbox } from '../ui/checkbox'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Link from 'next/link'
import { ADMIN_MEDIA_EDIT } from '@/routes/AdminPanelRoute'
import { MdOutlineEdit } from 'react-icons/md'
import { IoIosLink } from 'react-icons/io'
import { LuTrash } from 'react-icons/lu'
import { showToast } from '@/lib/showToast'

const Media = ({media, handleDelete, deleteType, selectedMedia, setSelectedMedia}) => {
    const handleCheck = () =>{
        let newSelectedMedia = []
        if(selectedMedia.includes(media._id)){
            newSelectedMedia = selectedMedia.filter(m => m !== media._id)
        }else{
            newSelectedMedia = [...selectedMedia, media._id]
        }
        setSelectedMedia(newSelectedMedia)
    }
    const handleCopyLink = async(url) =>{
        await navigator.clipboard.writeText(url)
        showToast('success', 'Link Copied')
    }
  return (
    <div className='border border-gray-200 dark:border-r-gray-800 relative group rounded overflow-hidden'>
        <div className='absolute left-2 top-2 z-20'>
            <Checkbox
                checked={selectedMedia.includes(media._id)}
                onCheckedChange={handleCheck}
                className='border-primary cursor-pointer'
            />
        </div>
        <div className='absolute top-2 right-2 z-20'>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <span><BsThreeDotsVertical/></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    {deleteType === 'SD' &&
                        <>
                            <DropdownMenuItem asChild className='cursor-pointer'>
                                <Link href={ADMIN_MEDIA_EDIT(media._id)} className="flex items-center space-x-2">
                                    <MdOutlineEdit/>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() =>handleCopyLink(media.secure_url)}>
                                <Link href={'#'} className="flex items-center space-x-2">
                                    <IoIosLink /> <span>Copy Link</span>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    }
                    <DropdownMenuItem className='cursor-pointer' onClick={()=> handleDelete([media._id], deleteType)}>
                            <LuTrash color='red'/> 
                            {deleteType === 'SD' ? 'Move into Trash' : 'Delete Permanantly'}
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className='w-full h-full absolute z-10 transition-all duration-150 ease-in group-hover:bg-black/30'></div>
        <div>
            <Image src={media?.secure_url} height={300} width={300} 
            alt={media?.alt || 'Image'} className='object-cover w-full sm:h-[200px] h-[150px]'/>
        </div>
    </div>
  )
}

export default Media