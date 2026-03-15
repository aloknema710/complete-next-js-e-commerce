'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useFetch from '@/hooks/useFetch'
import Image from 'next/image'
import notFound from '@/public/assets/images/not-found.png'
import { statusBadge } from '@/lib/helperFunction'


const LatestOrder = () => {
    const [latestOrder, setLatestOrder] = useState()
    const {data, loading} = useFetch('/api/dashboard/admin/latest-order')

    useEffect(()=>{
      if(data && data.success) setLatestOrder(data.data)
    },[data])

    if(loading) return <div className='h-full w-full flex justify-center items-center'>Loading...</div>
    if(!latestOrder || latestOrder.length === 0) return <div className='h-full w-full flex justify-center items-center'>
                <Image src={notFound} width={notFound.width} height={notFound.height} alt='not found' className='w-20'/>
    </div>

  return (
    <div>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead >Order ID</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={'text-right'}>Amount</TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {/* {Array.from({length: 20}).map(((_, i)=>(
              <TableRow key={i}>
              <TableCell >{`INV00${i}`}</TableCell>
              <TableCell >{`PAYMENT${i}`}</TableCell>
              <TableCell >3</TableCell>
              <TableCell >Pending</TableCell>
              <TableCell className={'text-right'}>100</TableCell>
              </TableRow>
            )))} */}
            {latestOrder?.map((order)=>(
              <TableRow key={order._id}>
                <TableCell >{order._id}</TableCell>
                <TableCell >{order.payment_id}</TableCell>
                <TableCell >{order.products.length}</TableCell>
                <TableCell >{statusBadge(order.status)}</TableCell>
                <TableCell >{order.totalAmount}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  )
}

export default LatestOrder