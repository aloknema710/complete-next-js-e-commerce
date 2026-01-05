import { NextResponse } from "next/server"
import { WEBSITE_ROUTE } from "./routes/WebsiteRoute"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')
        
        // If no token and trying to access protected routes
        if(!hasToken){
            if(pathname.startsWith('/admin') || pathname.startsWith('/my-account')) {
                return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
            }
            return NextResponse.next()
        }

        // Verify token
        const access_token = request.cookies.get('access_token')
        const {payload} = await jwtVerify(access_token.value, new TextEncoder().encode(process.env.SECRET_KEY))
        const role = payload.role

        // Prevent logged in users from accessing auth routes
        if(pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(
                role === 'admin' ? ADMIN_DASHBOARD : WEBSITE_ROUTE.USER_DASHBOARD, 
                request.nextUrl
            ))
        }

        // Protect admin routes - only admin can access
        if(pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
        }

        // Protect user routes - only user can access  
        if(pathname.startsWith('/my-account') && role !== 'user') {
            return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
        }

        // If all checks pass, allow the request
        return NextResponse.next()
        
    } catch (error) {
        console.error('Middleware error:', error)
        // Clear invalid token and redirect to login
        const response = NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
        response.cookies.delete('access_token')
        return response
    }
}

export const config = {
    matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*']
}



// import { NextResponse } from "next/server"
// import { WEBSITE_ROUTE } from "./routes/WebsiteRoute"
// import { jwtVerify } from "jose"
// import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute"

// export async function middleware(request) {
//     try {
//         const pathname = request.nextUrl.pathname
//         const hasToken = request.cookies.has('access_token')
//         if(!hasToken){
//             //if user is not logged in and trying to access protected route, redirect to login page
//             if(!pathname.startsWith('/auth')) return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
//             return NextResponse.next()
//         }
//         const access_token = request.cookies.get('access_token')
//         const {payload} = await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))
//         const role = payload.role
//         // prevent logged in one's from accessing auth routes
//         if(pathname.startsWith('/auth')) return NextResponse.redirect(new URL(role === 'admin' ? ADMIN_DASHBOARD : WEBSITE_ROUTE.USER_DASHBOARD, request.nextUrl))
//         //protecting admin route
//         if(pathname.startsWith('/admin') && role !== 'admin') return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
//             // protect user route
//         if(pathname.startsWith('/my-account') && role !== 'user') return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
//         return NextResponse.next()
//     } catch (error) {
//         return NextResponse.redirect(new URL(WEBSITE_ROUTE.LOGIN, request.nextUrl))
//     }
// }

// export const config = {
//     matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*']
// }