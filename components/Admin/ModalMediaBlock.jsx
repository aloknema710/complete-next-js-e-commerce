import React from 'react'
import { Checkbox } from '../ui/checkbox'
import Image from 'next/image'

const ModalMediaBlock = ({media, selectedMedia, setSelectedMedia, isMultiple}) => {
    // Add safety check - ensure selectedMedia is always an array
    const safeSelectedMedia = selectedMedia || []
    
    const handleCheck = () => {
        let newSelectedMedia = []
        // Use safeSelectedMedia instead of selectedMedia
        const isSelected = safeSelectedMedia.find(m => m._id === media._id) ? true : false
        console.log('isSelected', isSelected)
        
        if(isMultiple){
            if(isSelected){
                newSelectedMedia = safeSelectedMedia.filter(m => m._id !== media._id)
                setSelectedMedia(newSelectedMedia)
            } else {
                newSelectedMedia = [...safeSelectedMedia, {
                    _id: media._id,
                    secure_url: media.secure_url,
                    alt: media.alt
                }]
                setSelectedMedia(newSelectedMedia)
            }
        } else {
            setSelectedMedia([{
                _id: media._id,
                secure_url: media.secure_url,
                alt: media.alt
            }])
        }
    }

    // Use safeSelectedMedia for the checked state as well
    const isChecked = safeSelectedMedia.find(m => m._id === media._id) ? true : false

    return (
        <label htmlFor={media._id} className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden'>
            <div className='absolute top-2 left-2 z-20'>
                <Checkbox 
                    id={media._id} 
                    checked={isChecked}
                    onCheckedChange={handleCheck}
                />
            </div>
            <div className='size-full relative'>
                <Image 
                    src={media.secure_url} 
                    alt={media.alt || ''} 
                    width={300}
                    height={300} 
                    className='object-cover md:h-[150px] h-[100px]'
                />
            </div>
        </label>
    )
}

export default ModalMediaBlock



// import React from 'react'
// import { Checkbox } from '../ui/checkbox'
// import Image from 'next/image'
// const ModalMediaBlock = ({media, selectedMedia, setSelectedMedia, isMultiple}) => {
//     const handleCheck = () =>{
//         let newSelectedMedia = []
//         const isSelected = selectedMedia.find(m=>m._id === media._id) ? true : false
//         console.log('isSelected', isSelected)
//         if(isMultiple){
//             if(isSelected){
//                 newSelectedMedia = selectedMedia.filter(m=>m._id !== media._id)
//                 setSelectedMedia(newSelectedMedia)
//             }else{
//                 newSelectedMedia = [...selectedMedia, {
//                     _id: media._id,
//                     secure_url: media.secure_url,
//                     alt: media.alt
//                 }]
//             }
//             setSelectedMedia(newSelectedMedia)
//         }
//         else{
//             setSelectedMedia([{
//                 _id: media._id,
//                 secure_url: media.secure_url,
//                 alt: media.alt
//             }])
//         }
//     }
//   return (
//     <label htmlFor={media._id} className=' border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden'>
//         <div className='absolute top-2 left-2 z-20'>
//             <Checkbox _id={media._id} checked={selectedMedia.find(m=>m._id === media._id) ? true : false}
//                 onCheckedChange={handleCheck}/>
//         </div>
//         <div className=' size-full relative'>
//             <Image src={media.secure_url} alt={media.alt || ''} width={300}
//              height={300} className='object-cover md:h-[150px] h-[100px]'/>
//         </div>
//     </label>
//   )
// }

// export default ModalMediaBlock