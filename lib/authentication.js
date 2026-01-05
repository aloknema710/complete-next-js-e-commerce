import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export const isAuthenticated = async (requiredRole = null) => {
    try {
        console.log("🔐 Starting authentication check...");
        
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        
        console.log("🍪 Token from cookie:", token ? "Present" : "Missing");
        
        if (!token) {
            console.log("❌ No token found in cookies");
            return { isAuth: false, user: null };
        }

        console.log("🔑 Token found, verifying...");
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);
        
        console.log("✅ Token verified successfully. User payload:", payload);
        
        if (requiredRole && payload.role !== requiredRole) {
            console.log(`❌ Role mismatch. Required: ${requiredRole}, User has: ${payload.role}`);
            return { isAuth: false, user: payload };
        }
        
        console.log("🎉 Authentication successful!");
        return { isAuth: true, user: payload };
        
    } catch (error) {
        console.error("❌ Authentication error:", error);
        console.error("🔍 Error details:", error.message);
        return { isAuth: false, user: null };
    }
};