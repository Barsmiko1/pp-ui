"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Overview } from "@/components/dashboard/overview"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { userApi } from "@/lib/api-service"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await userApi.getCurrentUser()
        setUserData(data)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    // Retry fetching user data
    userApi
      .getCurrentUser()
      .then((data) => {
        setUserData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching user data:", err)
        setError("Failed to load user data. Please try again.")
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return <Loading text="Loading dashboard..." />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your recent transaction activity</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
