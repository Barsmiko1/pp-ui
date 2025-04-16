import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`

  const token = await getToken({ req })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token?.accessToken) {
    headers["Authorization"] = `Bearer ${token.accessToken}`
  }

  try {
    const response = await fetch(apiUrl, {
      headers,
      cache: "no-store",
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(`Error proxying GET request to ${apiUrl}:`, error)
    return NextResponse.json({ message: "Failed to fetch data from API" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`

  const token = await getToken({ req })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token?.accessToken) {
    headers["Authorization"] = `Bearer ${token.accessToken}`
  }

  try {
    const body = await req.json()

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(`Error proxying POST request to ${apiUrl}:`, error)
    return NextResponse.json({ message: "Failed to post data to API" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`

  const token = await getToken({ req })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token?.accessToken) {
    headers["Authorization"] = `Bearer ${token.accessToken}`
  }

  try {
    const body = await req.json()

    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(`Error proxying PUT request to ${apiUrl}:`, error)
    return NextResponse.json({ message: "Failed to update data in API" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${path}`

  const token = await getToken({ req })

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token?.accessToken) {
    headers["Authorization"] = `Bearer ${token.accessToken}`
  }

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error(`Error proxying DELETE request to ${apiUrl}:`, error)
    return NextResponse.json({ message: "Failed to delete data in API" }, { status: 500 })
  }
}
