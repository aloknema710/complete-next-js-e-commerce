'use client'
import React, { useEffect, useState } from 'react'
import { IoStar } from 'react-icons/io5'
import { Progress } from '../ui/progress'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zSchema } from '@/lib/zodSchema'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'
import { Textarea } from '../ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import ButtonLoading from '../Application/ButtonLoading'
import Link from 'next/link'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import { showToast } from '@/lib/showToast'
import axios from 'axios'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ReviewList from './ReviewList'
// ButtonLoading

const ProductReview = ({productId}) => {

    const auth = useSelector(store=>store.authStore.auth)
    console.log('AUTH IN REVIEW COMPONENT:', auth.data.user.id)

    const [loading, setLoading] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('')
    const [isReview, setIsReview] = useState(false)
    const QueryClient = useQueryClient()

        useEffect(()=>{
            if(typeof window !== 'undefined') setCurrentUrl(window.location.href)
        },[])

        const formSchema = zSchema.pick({
            product: true,
            userId: true,
            rating: true,
            title: true,
            review: true,
            // password: true
          });
        
          const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: {
              product: productId,
                userId: auth?.data?.user?.id || '',
                rating: null,
                title: '',
                review: '',
            },
          });

          console.log('FORM WATCH:', form.formState.errors)

          useEffect(() => {
            form.setValue('userId', auth?.data?.user?.id)
          }, [auth])
          
            const handleReviewSubmit = async (values) => {
                setLoading(true)
                console.log('FORM VALUES:', values)

                try {
                    const{data: response} = await axios.post('/api/review/create', values)
                    if(!response.success) throw new Error(response.message);
                    form.reset()
                    showToast('success', response.message)
                    QueryClient.invalidateQueries(['product-reviews'])
                } catch (error) {
                    showToast(error)
                }finally{
                    setLoading(false)
                }
            }


        const fetchReviews = async (pageParam) => {
            const {data: getReviewData} = await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)
            if(!getReviewData.success) throw new Error(getReviewData.message)

            return getReviewData.data
        }


        const{error,data,isFetching,fetchNextPage,hasNextPage} = useInfiniteQuery({
            queryKey: ['product-reviews'],
            queryFn: async({pageParam})=> await fetchReviews(pageParam),
            initialPageParam: 0,
            getNextPageParam:(lastPage)=>{
              return lastPage.nextPage
            }
        })

        console.log('REVIEWS DATA:', data)

  return (
    <div className=' shadow rounded border mb-10'>
        <div className='p-3 bg-gray-50 border-b'>
            <h2 className=' font-semibold text-2xl'>Ratings & Reviews</h2>
        </div>                    

        <div className=' p-3'>
            <div className=' flex justify-between items-center flex-wrap'>
                <div className='md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5'>
                    
                    <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                        <h4 className='text-center text-8xl font-semibold'>0.0</h4>
                        <div className=' flex justify-center gap-2'>
                            <IoStar/>
                            <IoStar/>
                            <IoStar/>
                            <IoStar/>
                            <IoStar/>
                        </div>

                        <p className='text-center mt-3'>(0 Ratings & Reviews)</p>
                    </div>

                    <div className=' md:w-[calc(100%-200px)] flex items-center'>
                        <div className=' w-full'>
                            {[5,4,3,2,1].map((rating)=>(
                                <div key={rating} className=' flex items-center gap-2 mb-2'>
                                    <div className=' flex items-center gap-1'>
                                        <p className=' w-3'>{rating}</p>
                                        <IoStar/>
                                    </div>
                                    <Progress value={20}/>
                                    <span className=' text-sm'>20</span>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2 w-full md:text-end text-center'>
                    <Button onClick={()=>setIsReview(!isReview)} type="button" variant={"outline"} className={"md:w-fit w-full py-6 px-10"}>
                        Write Review
                    </Button>
                </div>
            </div>
            
            {
              isReview && 

            <div className=' my-5'>
                <hr className=' mb-5'/>
                <h4 className=' font-semibold mb-3 text-xl'>Write a Review</h4>
                {!auth ? 
                    <>
                        <p>Login to submit Review</p>
                        <Button type="button" asChild>
                            <Link href={`${WEBSITE_ROUTE.LOGIN}?callback=${currentUrl}`}>Login</Link>
                        </Button>
                    </>
                :
                    <>
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleReviewSubmit)}>
                          
                          
                          <div className="mb-5">
                            <FormField
                              control={form.control}
                              name="rating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rating</FormLabel>
                                  <FormControl>
                                    <Rating
                                        value={field.value}
                                        size='large'
                                        {...field} 
                                        // onChange={(_, value) => field.onChange(value)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mb-5">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Enter Title" {...field}/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mb-5">
                            <FormField
                              control={form.control}
                              name="review"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Review</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="write your review here" {...field}/>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="mb-3">
                            <ButtonLoading
                              loading={loading}
                              type="submit"
                              text="Submit Review"
                            ></ButtonLoading>
                          </div>
                        </form>
                      </Form>
                    </>
                }
                    

            </div>
            }
            

            <div className=' mt-10 border-t pt-5'>
                <h4 className=' font-semibold mb-5 text-xl'>Total Customer Reviews :{data?.pages[0]?.totalReviews}</h4>
                <div className='mt-10'>
                    {data && data.pages.map(page=>(
                        page.reviews.map(review=>(
                          <div className=' mb-3' key={review._id}>
                             <ReviewList review={review}/>
                          </div>
                        ))
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProductReview



