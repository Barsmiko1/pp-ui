"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function BybitCredentialsPage() {
  const { data: session } = useSession()
  const [credentials, setCredentials] = useState({
    apiKey: "",
    secretKey: "",
  })
  const [existingCredentials, setExistingCredentials] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await fetch("/api/proxy/bybit/credentials", {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setExistingCredentials(data.data)
            setCredentials({
              apiKey: data.data.apiKey || "",
              secretKey: data.data.secretKey ? "••••••••••••••••" : "",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching Bybit credentials:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.accessToken) {
      fetchCredentials()
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Don't send masked secret key to the backend
      const payload = {
        apiKey: credentials.apiKey,
        secretKey: credentials.secretKey === "••••••••••••••••" ? undefined : credentials.secretKey,
      }

      const method = existingCredentials ? "PUT" : "POST"
      const endpoint = existingCredentials
        ? `/api/proxy/bybit/credentials/${existingCredentials.id}`
        : "/api/proxy/bybit/credentials"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Bybit credentials saved successfully!",
        })

        if (!existingCredentials) {
          setExistingCredentials(data.data)
        }
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to save Bybit credentials",
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Bybit API Credentials</h1>

      {message.text && (
        <Alert
          className={`mb-6 ${message.type === "error" ? "bg-red-50 text-red-800 border-red-200" : "bg-green-50 text-green-800 border-green-200"}`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                name="apiKey"
                value={credentials.apiKey}
                onChange={handleChange}
                required
                placeholder="Enter your Bybit API Key"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <Input
                id="secretKey"
                name="secretKey"
                type="password"
                value={credentials.secretKey}
                onChange={handleChange}
                required
                placeholder={
                  existingCredentials ? "Leave unchanged to keep current secret key" : "Enter your Bybit Secret Key"
                }
              />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Credentials"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">How to get your Bybit API credentials:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Log in to your Bybit account</li>
              <li>Go to Account & Security &gt; API Management</li>
              <li>Create a new API key with trading permissions</li>
              <li>Copy the API Key and Secret Key</li>
              <li>Paste them in the form above</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
