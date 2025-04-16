// app/api/proxy/[...path]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { unstable_noStore as noStore } from "next/cache"

// Add noStore() to disable cache
noStore()

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const pathSegments = params?.path || []
    const path = pathSegments.join("/")
    const apiUrl = `${API_BASE_URL}/${path}`

    const searchParams = req.nextUrl.searchParams.toString()
    const fullUrl = searchParams ? `${apiUrl}?${searchParams}` : apiUrl

    const token = await getToken({ req })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token?.accessToken) {
      headers["Authorization"] = `Bearer ${token.accessToken}`
    }

    console.log(`Proxying GET request to: ${fullUrl}`)
    const response = await fetch(fullUrl, {
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch data from API" }))
      console.error(`API error (${response.status}):`, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying GET request to ${req.url}:`, error)
    return NextResponse.json({ message: "Failed to fetch data from API" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const pathSegments = params?.path || []
    const path = pathSegments.join("/")
    const apiUrl = `${API_BASE_URL}/${path}`

    const token = await getToken({ req })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token?.accessToken) {
      headers["Authorization"] = `Bearer ${token.accessToken}`
    }

    const body = await req.json()
    console.log(`Proxying POST request to: ${apiUrl}`, body)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to post data to API" }))
      console.error(`API error (${response.status}):`, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying POST request to ${req.url}:`, error)
    return NextResponse.json({ message: "Failed to post data to API" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const pathSegments = params?.path || []
    const path = pathSegments.join("/")
    const apiUrl = `${API_BASE_URL}/${path}`

    const token = await getToken({ req })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token?.accessToken) {
      headers["Authorization"] = `Bearer ${token.accessToken}`
    }

    const body = await req.json()
    console.log(`Proxying PUT request to: ${apiUrl}`, body)

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to update data in API" }))
      console.error(`API error (${response.status}):`, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying PUT request to ${req.url}:`, error)
    return NextResponse.json({ message: "Failed to update data in API" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const pathSegments = params?.path || []
    const path = pathSegments.join("/")
    const apiUrl = `${API_BASE_URL}/${path}`

    const token = await getToken({ req })

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token?.accessToken) {
      headers["Authorization"] = `Bearer ${token.accessToken}`
    }

    console.log(`Proxying DELETE request to: ${apiUrl}`)
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to delete data in API" }))
      console.error(`API error (${response.status}):`, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error proxying DELETE request to ${req.url}:`, error)
    return NextResponse.json({ message: "Failed to delete data in API" }, { status: 500 })
  }
}
