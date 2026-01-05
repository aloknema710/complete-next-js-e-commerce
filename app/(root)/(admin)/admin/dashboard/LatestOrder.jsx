import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const LatestOrder = () => {
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
            {Array.from({length: 20}).map(((_, i)=>(
              <TableRow key={i}>
              <TableCell >{`INV00${i}`}</TableCell>
              <TableCell >{`PAYMENT${i}`}</TableCell>
              <TableCell >3</TableCell>
              <TableCell >Pending</TableCell>
              <TableCell className={'text-right'}>100</TableCell>
              </TableRow>
            )))}
        </TableBody>
        </Table>
    </div>
  )
}

export default LatestOrder