// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getServerSession } from "next-auth/next"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usernameOrEmail: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            console.error("Authentication failed with status:", response.status)
            return null
          }

          const data = await response.json()

          if (!data.success) {
            return null
          }

          return {
            id: data.data?.user?.id || "1",
            name: data.data?.user?.name || credentials.email,
            email: credentials.email,
            image: data.data?.user?.image || null,
            accessToken: data.data?.accessToken,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.image = token.picture as string | null
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

// Export a function to get the session on the server side
export const auth = () => getServerSession(authOptions)
