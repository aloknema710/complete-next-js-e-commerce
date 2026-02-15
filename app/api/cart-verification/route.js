import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
        try {
                await connectDB()
                const payload = await request.json()
                const verifiedCartData = await Promise.all(
                        payload.map(async(cartItem)=>{
                const variant = await ProductVariantModel.findById(cartItem.variantId).populate('product').populate('media', 'secure_url').lean()
                console.log('variantId from cart:', cartItem.variantId)

                if(variant){
                        return{
                                productId: variant.product._id,
                                variantId: variant._id,
                                name: variant.product.name,
                                url: variant.product.slug,
                                size: variant.size,
                                color: variant.color,
                                mrp: variant.mrp,
                                sellingPrice: variant.sellingPrice,
                                media: variant ?. media[0] ?. secure_url,
                                qty: cartItem.qty
                    }
                }
            })
        )
        return response (true, 200, 'Verified Cart Data', verifiedCartData)
    } catch (error) {
            return catchError(error)
        }
    }
    
    
//     import { connectDB } from "@/lib/databaseConnection";
//     import { catchError, response } from "@/lib/helperFunction";
//     import ProductVariantModel from "@/models/ProductVariant.model";
//     import ProductModel from "@/models/Product.model";
    
// export async function POST(request) {
//   try {
//     await connectDB();

//     const payload = await request.json();

//     if (!Array.isArray(payload)) {
//       return response(false, 400, "Invalid cart payload");
//     }

//     const verifiedCartData = await Promise.all(
//       payload.map(async (cartItem) => {
//         const variant = await ProductVariantModel.findById(cartItem.variantId)
//           .populate("product")      // populate product data
//           .populate("media", "secure_url")
//           .lean();

//         if (variant) {
//           return {
//             productId: variant.product._id,
//             variantId: variant._id,
//             name: variant.product.name,
//             url: variant.product.slug,      // ✅ use variant.product.slug
//             size: variant.size,
//             color: variant.color,
//             mrp: variant.mrp,
//             sellingPrice: variant.sellingPrice,
//             media: variant?.media?.[0]?.secure_url,
//             qty: cartItem.qty,
//           };
//         }

//         return null;
//       })
//     );

//     // filter out nulls
//     const filteredData = verifiedCartData.filter((item) => item !== null);
//     console.log(filteredData)
//     return response(true, 200, "Verified Cart Data", filteredData);
//   } catch (error) {
//     return catchError(error);
//   }
// }

// import { connectDB } from '@/lib/databaseConnection';
// // import dbConnect from '@/lib/dbConnect';
// import ProductVariantModel from '@/models/ProductVariant.model';

// export async function POST(req) {
//   await connectDB();

//   try {
//     const { data: cartProducts } = await req.json();

//     const verifiedData = await Promise.all(
//       cartProducts.map(async (item) => {
//         const variant = await ProductVariantModel.findById(item.variantId)
//           .populate('product')
//           .lean();
//         if (!variant) return null;

//         return {
//           variantId: variant._id.toString(),
//           productId: variant.product._id.toString(),
//           name: variant.product.name,
//           url: variant.product.slug,
//           color: variant.color,
//           size: variant.size,
//           qty: item.qty,
//           sellingPrice: variant.sellingPrice,
//           mrp: variant.mrp,
//           media: variant.media[0]?.url || '',
//         };
//       })
//     );

//     return new Response(
//       JSON.stringify({ success: true, message: 'Cart verified', data: verifiedData }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ success: false, message: error.message, data: error }),
//       { status: 500 }
//     );
//   }
// }
