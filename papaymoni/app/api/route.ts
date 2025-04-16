import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "next-auth/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://18.232.93.166:8080/api"

/**
 * Proxy API handler that forwards requests to the Java backend
 * This allows us to avoid CORS issues and handle authentication in one place
 */
export async function GET(request: NextRequest) {
  const { searchParams, pathname } = new URL(request.url)
  const path = pathname.replace("/api/proxy", "")
  const endpoint = `${API_BASE_URL}${path}?${searchParams.toString()}`

  try {
    const session = await getSession({ req: request })
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch data from API" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace("/api/proxy", "")
  const endpoint = `${API_BASE_URL}${path}`

  try {
    const session = await getSession({ req: request })
    const body = await request.json()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to post data to API" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url)
  const path = pathname.replace("/api/proxy", "")
  const endpoint = `${API_BASE_URL}${path}`

  try {
    const session = await getSession({ req: request })
    const body = await request.json()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }

    const response = await fetch(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to update data in API" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url)
  const path = pathname.replace("/api/proxy", "")
  const endpoint = `${API_BASE_URL}${path}?${searchParams.toString()}`

  try {
    const session = await getSession({ req: request })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`
    }

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("API proxy error:", error)
    return NextResponse.json({ error: "Failed to delete data in API" }, { status: 500 })
  }
}
