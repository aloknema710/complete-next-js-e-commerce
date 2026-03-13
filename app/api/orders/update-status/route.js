import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/helperFunction";
// import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
// import "@/models/Product.model";
// import "@/models/ProductVariant.model";
// MediaModel

export async function PUT(request, { params }) {
  try {

    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "UnAuthorized");
    }

    await connectDB();
    // const { orderid } = await params;
    const {_id, status} = await request.json()

    if (!_id || !status) return response(false, 404, "Order id and status are required");

    const orderData = await OrderModel.findById(_id)

    if (!orderData) return response(false, 404, "Order not found");
    orderData.status = status
    await orderData.save()

    return response(true, 200, "Order status updated successfully", orderData);

  } catch (error) {
    console.error("ORDER FETCH ERROR:", error);
    return response(false, 500, error.message);
  }
}