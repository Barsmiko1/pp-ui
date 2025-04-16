// app/api/register/route.ts
import { NextResponse } from "next/server"
import { hash } from "bcrypt"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Make API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password: hashedPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }))
      return NextResponse.json({ message: errorData.message || "Registration failed" }, { status: response.status })
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}