"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useEffect, useState } from "react"
import { Error } from "@/components/ui/error"
import { orderApi, transactionApi } from "@/lib/api-service"
import { formatCurrency } from "@/lib/utils"

type DashboardData = {
  totalBalance: number
  pendingOrders: number
  completedOrders: number
  totalTransactions: number
}

export function DashboardCards() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData>({
    totalBalance: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalTransactions: 0,
  })

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch data in parallel
      const [buyOrdersResponse, sellOrdersResponse, transactionsResponse] = await Promise.all([
        orderApi.getBuyOrders(),
        orderApi.getSellOrders(),
        transactionApi.getTransactions(),
      ])

      const buyOrders = buyOrdersResponse.data
      const sellOrders = sellOrdersResponse.data
      const transactions = transactionsResponse.data

      // Calculate dashboard metrics
      const allOrders = [...buyOrders, ...sellOrders]
      const pendingOrders = allOrders.filter((order) => order.status === 10 || order.status === 20).length
      const completedOrders = allOrders.filter((order) => order.status === 70).length

      // Calculate total balance from transactions
      const deposits = transactions
        .filter((tx) => tx.transactionType.toUpperCase() === "DEPOSIT" && tx.status.toUpperCase() === "COMPLETED")
        .reduce((sum, tx) => sum + tx.amount, 0)

      const withdrawals = transactions
        .filter((tx) => tx.transactionType.toUpperCase() === "WITHDRAWAL" && tx.status.toUpperCase() === "COMPLETED")
        .reduce((sum, tx) => sum + tx.amount, 0)

      const fees = transactions
        .filter((tx) => tx.transactionType.toUpperCase() === "FEE" && tx.status.toUpperCase() === "COMPLETED")
        .reduce((sum, tx) => sum + tx.amount, 0)

      const totalBalance = deposits - withdrawals - fees

      setData({
        totalBalance,
        pendingOrders,
        completedOrders,
        totalTransactions: transactions.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      console.error("Error fetching dashboard data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (error) {
    return <Error message={error} onRetry={fetchDashboardData} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Icons.dollar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : formatCurrency(data.totalBalance)}
          </div>
          <p className="text-xs text-muted-foreground">Available for trading</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Icons.refresh className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : data.pendingOrders}
          </div>
          <p className="text-xs text-muted-foreground">Awaiting completion</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
          <Icons.check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : data.completedOrders}
          </div>
          <p className="text-xs text-muted-foreground">Successfully processed</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <Icons.chart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : data.totalTransactions}
          </div>
          <p className="text-xs text-muted-foreground">All-time activity</p>
        </CardContent>
      </Card>
    </div>
  )
}
