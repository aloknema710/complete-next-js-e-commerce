// import { connectDB } from "@/lib/databaseConnection";
// import { response } from "@/lib/helperFunction";
// import OrderModel from "@/models/Order.model";
// import ProductModel from "@/models/Product.model";
// import ProductVariantModel from "@/models/ProductVariant.model";

// export async function GET(request, {params}) {
//     try {
//         await connectDB()
//         const getParams = await params
//         const orderid = getParams.orderid
//         if(!orderid) return response(false, 404, 'Order not found')
            
//         const orderData = await OrderModel.findOne({order_id: orderid})
//         .populate('products.productId','name slug')
//         .populate({path: 'products.variantId', populate: {path: 'media'}}).lean()

//         // const orderData = await OrderModel.findOne({ order_id: orderid }).lean();


//         if(!orderData) return response(false, 404, 'Order not found')
//         return response(true, 200, 'Order data fetched successfully', orderData)
//         } catch (error) {
//         console.error("ORDER FETCH ERROR:", error)
//         return response(false, 500, "Internal Server Error")
//     }
// }



import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import "@/models/Product.model";
import "@/models/ProductVariant.model";
// MediaModel

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { orderid } = await params;

    if (!orderid) return response(false, 404, "Order not found");

    const orderData = await OrderModel.findOne({ order_id: orderid })
      .populate({ path: "products.productId", select: "name slug" })
      .populate({
        path: "products.variantId",
        select: "color size media",
        populate: { path: "media", select: "secure_url" }
      })
      .lean();

    if (!orderData) return response(false, 404, "Order not found");

    return response(true, 200, "Order data fetched successfully", orderData);

  } catch (error) {
    console.error("ORDER FETCH ERROR:", error);
    return response(false, 500, error.message);
  }
}


// export async function GET(request, { params }) {
//   try {
//     await connectDB();

//     const { orderid } = params; // ❌ no await

//     if (!orderid) {
//       return response(false, 404, "Order not found");
//     }

//     const orderData = await OrderModel.findOne({ order_id: orderid })
//       .populate({
//         path: "products.productId",
//         select: "name slug",
//       })
//       .populate({
//         path: 'products.variantId',
//         select: 'color size media',
//         populate: {
//             path: 'media',          // <- populate the media field
//             select: 'secure_url'    // <- only select the URL
//         }
//         })
//       .lean();

//     if (!orderData) {
//       return response(false, 404, "Order not found");
//     }

//     return response(
//       true,
//       200,
//       "Order data fetched successfully",
//       orderData
//     );

//   } catch (error) {
//     console.error("ORDER FETCH ERROR:", error);
//     return response(false, 500, error.message); // show real error while testing
//   }
// }



// export async function GET(request, { params }) {
//   try {
//     await connectDB();

//     const { orderid } = params;

//     if (!orderid) {
//       return response(false, 404, "Order not found");
//     }

//     const orderData = await OrderModel.findOne({ order_id: orderid })
//       .populate({
//         path: "products.productId",
//         select: "name slug",
//       })
//       .populate({
//         path: "products.variantId",
//         select: "color size media",
//       })
//       .lean();

//     if (!orderData) {
//       return response(false, 404, "Order not found");
//     }

//     return response(
//       true,
//       200,
//       "Order data fetched successfully",
//       orderData
//     );
//   } catch (error) {
//     console.error("ORDER FETCH ERROR:", error);
//     return response(false, 500, "Internal Server Error");
//   }
// }