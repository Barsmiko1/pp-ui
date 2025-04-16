"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { bybitApi } from "@/lib/api-service"

export default function BybitSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [credentials, setCredentials] = useState<{
    apiKey: string
    apiSecret: string
  }>({
    apiKey: "",
    apiSecret: "",
  })
  const [hasCredentials, setHasCredentials] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const fetchCredentials = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await bybitApi.getCredentials()
      const data = response.data

      setCredentials({
        apiKey: data.apiKey,
        apiSecret: "••••••••••••••••", // Mask the secret
      })
      setHasCredentials(true)
      setIsVerified(data.verified)
    } catch (err) {
      // If 404, user doesn't have credentials yet
      if (err instanceof Error && err.message.includes("404")) {
        setHasCredentials(false)
        setIsVerified(false)
      } else {
        setError(err instanceof Error ? err.message : "Failed to load Bybit credentials")
        console.error("Error fetching Bybit credentials:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleSave = async () => {
    if (!credentials.apiKey || !credentials.apiSecret || credentials.apiSecret === "••••••••••••••••") {
      toast({
        title: "Error",
        description: "API Key and Secret are required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await bybitApi.saveCredentials({
        apiKey: credentials.apiKey,
        apiSecret: credentials.apiSecret === "••••••••••••••••" ? "" : credentials.apiSecret,
      })

      setHasCredentials(true)
      toast({
        title: "Success",
        description: "Bybit credentials saved successfully",
      })

      // Refresh credentials
      await fetchCredentials()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save Bybit credentials",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      const response = await bybitApi.verifyCredentials()
      setIsVerified(response.data)

      if (response.data) {
        toast({
          title: "Success",
          description: "Bybit credentials verified successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Bybit credentials verification failed",
          variant: "destructive",
        })
      }

      // Refresh credentials
      await fetchCredentials()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to verify Bybit credentials",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bybit Settings</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>Connect your Bybit account by providing your API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Loading text="Loading Bybit credentials..." />
          ) : error ? (
            <Error message={error} onRetry={fetchCredentials} />
          ) : (
            <>
              {isVerified && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <Icons.check className="h-4 w-4" />
                  <AlertTitle>Verified</AlertTitle>
                  <AlertDescription>
                    Your Bybit API credentials have been verified and are working correctly.
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    value={credentials.apiKey}
                    onChange={handleChange}
                    placeholder="Enter your Bybit API Key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret</Label>
                  <Input
                    id="apiSecret"
                    name="apiSecret"
                    type="password"
                    value={credentials.apiSecret}
                    onChange={handleChange}
                    placeholder={
                      hasCredentials ? "Leave unchanged to keep current secret" : "Enter your Bybit API Secret"
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Save Credentials
                  </Button>
                  {hasCredentials && (
                    <Button variant="outline" onClick={handleVerify} disabled={isVerifying}>
                      {isVerifying && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                      Verify Connection
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium mb-2">How to get your Bybit API credentials:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Log in to your Bybit account</li>
                  <li>Go to Account & Security &gt; API Management</li>
                  <li>Create a new API key with trading permissions</li>
                  <li>Copy the API Key and Secret Key</li>
                  <li>Paste them in the form above</li>
                </ol>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
