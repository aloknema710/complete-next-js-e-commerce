export const WEBSITE_ROUTE = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  RESETPASSWORD: '/auth/reset-password',
  USER_DASHBOARD: '/my-account',
  SHOP:'/shop',
  PRODUCT_DETAILS: (slug) => slug ? `/product/${slug}` : `/product`,
  CART:'/cart',
}