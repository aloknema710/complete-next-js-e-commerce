import Image from 'next/image'
import React from 'react'
import logo from '@/public/assets/images/logo-black.png'
import Link from 'next/link'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import { IoLocationOutline } from 'react-icons/io5'
import { MdOutlineMail, MdOutlinePhone } from 'react-icons/md'
import { AiOutlineYoutube } from 'react-icons/ai'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { TiSocialFacebookCircular } from 'react-icons/ti'
import { FiTwitter } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className='bg-gray-50 border-t'>
        <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1'>

            <div className=' mt-2'>
                <Image
                  src={logo}
                  width={383}
                  height={146}
                  alt='logo'
                  className='w-36 mb-2'
                />
                <p className='text-gray-500 text-sm'>
                     E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.
                </p>
            </div>

            <div>
                <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
                <ul>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Tshirt</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Hoodies</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>OverSized</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Full Sleeved</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Polo</Link>
                  </li>
                </ul>
            </div>
            <div>
                <h4 className='text-xl font-bold uppercase mb-5'>Useful Links</h4>
                <ul>
                  <li className='mb-2 text-gray-500'>
                    <Link href={WEBSITE_ROUTE.HOME}>Home</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Shop</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>About</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href={WEBSITE_ROUTE.REGISTER}>Register</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href={WEBSITE_ROUTE.LOGIN}>Login</Link>
                  </li>
                </ul>
            </div>
            <div>
                <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
                <ul>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Register</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Login</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>My Account</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Privacy Policy</Link>
                  </li>
                  <li className='mb-2 text-gray-500'>
                    <Link href=''>Terms & Consitions</Link>
                  </li>
                </ul>
            </div>
            <div>
                <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
                <ul>
                  <li className='mb-2 text-gray-500 flex gap-2'>
                    <IoLocationOutline/>
                    <span className=' text-sm'>123 Street, City, Country</span>
                  </li>
                  
                  <li className='mb-2 text-gray-500 flex gap-2'>
                    <MdOutlinePhone/>
                    <Link href='+91-7894562135' className='hover:text-primary'>+91-7894562135</Link>
                  </li>
                  
                  <li className='mb-2 text-gray-500 flex gap-2'>
                    <MdOutlineMail/>
                    <Link href='Mailto:support@Estore.com' className='hover:text-primary'>support@Estore.com</Link>
                  </li>
                </ul>

                <div className=' flex gap-5 mt-5'>
                  <Link href={''}><AiOutlineYoutube className=' text-primary' size={25}/></Link>
                  <Link href={''}><FaInstagram className=' text-primary' size={25}/></Link>
                  <Link href={''}><FaWhatsapp className=' text-primary' size={25}/></Link>
                  <Link href={''}><TiSocialFacebookCircular className=' text-primary' size={25}/></Link>
                  <Link href={''}><FiTwitter className=' text-primary' size={25}/></Link>
                </div>
            </div>
        </div>

        <div className=' py-5 bg-gray-100'>
            <p className=' text-center text-gray-500 text-sm'>&copy; 2025 E-store. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer