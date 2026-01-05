import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import Fuse from 'fuse.js'
import searchData from '@/lib/search.js'
import Link from 'next/link'

const options = {
  keys:['label', 'description', 'keywords'],
  threshold: 0.3
}

const SearchModel = ({ open, setOpen}) => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState([])
  const fuse = new Fuse(searchData, options)
  
  useEffect(() =>{
      if(query.trim() === '') setResult([])
      const res = fuse.search(query)
      console.log(res)
      setResult(res.map((r)=>r.item))
  }, [query])
  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>


            <DialogContent>
                <DialogHeader>
                    <DialogTitle>QuickSearch</DialogTitle>
                        <DialogDescription>
                            Find and navigate to any admin section instantly. Type a keyword to get started.
                        </DialogDescription>
                </DialogHeader>
                <Input placeholder='Search...' value={query}
                  onChange={(e) => setQuery(e.target.value)
                  }
                  autoFocus
                />
                <ul className=' mt-4 max-h-60 overflow-y-auto'>
                  {result.map((item,index) =>(
                    <li key={index}>
                        <Link href={item.url} className='block py-2 px-3 rounded hover:bg-muted' onClick={()=>setOpen(false)}>
                            <h4>{item.label}</h4>
                            <p>{item.description}</p>
                        </Link>
                    </li>
                  ))}
                  {query && result.length === 0 && 
                    <div className=' text-sm text-center text-red-600 mt-4'>
                        No Results Found
                    </div>
                  }
                </ul>
            </DialogContent>
          </DialogTrigger>
        </Dialog>
    </div>
  )
}

export default SearchModel