import React from 'react'
import axios from 'axios'
import ProductDetail from './ProductDetail'

const ProductPage = async ({ params, searchParams }) => {
  const { slug } = await params
  const { color, size } = await searchParams || {}

  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`

  if (color && size) {
    url += `?color=${color}&size=${size}`
  }

  const { data: getProduct } = await axios.get(url)
  console.log(getProduct)

  if(!getProduct.success){
    return(
        <div className='flex justify-center items-center py-10 h-[300px]:'>
            <h1 className='text-4xl font-semibold'>Data not Found</h1>
        </div>
    )
  }else{
    
    return (
    <ProductDetail product={getProduct?.data?.products} 
                variant={getProduct?.data?.variant}
                colors={getProduct?.data?.colors}
                sizes={getProduct?.data?.size}
                reviewCount={getProduct?.data?.reviewCount}

    />
    )
  }

  
}

export default ProductPage



// import React from 'react'

// const ProductPage = async({params, searchParams}) => {
//     const {slug} = await params
//     const {color, size} = await searchParams

//     let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`
//     if(color && size)    url += `?color=${color}&size=${size}`

//     const {data: getProduct} = await axios.get(url)
//     console.log(getProduct)
//   return (
//     <div>ProductPage</div>
//   )
// }

// export default ProductPage