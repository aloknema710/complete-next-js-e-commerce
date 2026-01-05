import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectDB()
        const cookieStore = await cookies()
        cookieStore.delete('access_token', { path: '/' })
        // return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 })
        return response(true, 200, 'Logged Out Succesfully')
    } catch (error) {
        catchError(error);
    }
}