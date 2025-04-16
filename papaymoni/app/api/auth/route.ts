import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// This is the correct way to export the handler for App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
