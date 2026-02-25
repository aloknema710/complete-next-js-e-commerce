export const WEBSITE_ROUTE = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  RESETPASSWORD: '/auth/reset-password',
  
  USER_DASHBOARD: '/my-account',
  USER_PROFILE: '/profile',
  USER_ORDERS: '/orders',

  SHOP:'/shop',
  PRODUCT_DETAILS: (slug) => slug ? `/product/${slug}` : `/product`,
  CART:'/cart',
  CHECKOUT: "/checkout",
  ORDER_DETAILS: (order_id) => `/order-details/${order_id}`
}