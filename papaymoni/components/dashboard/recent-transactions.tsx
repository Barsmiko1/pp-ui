"use client"

import { useEffect, useState } from "react"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { EmptyState } from "@/components/ui/empty-state"
import { transactionApi } from "@/lib/api-service"
import type { Transaction } from "@/types"
import { formatCurrency } from "@/lib/utils"

export function RecentTransactions() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await transactionApi.getTransactions()
      // Sort by date descending and take the first 5
      const sortedTransactions = response.data
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      setTransactions(sortedTransactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions")
      console.error("Error fetching transactions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "DEPOSIT":
        return <Icons.arrowDown className="h-4 w-4 text-green-600" />
      case "WITHDRAWAL":
        return <Icons.arrowUp className="h-4 w-4 text-red-600" />
      case "FEE":
        return <Icons.dollar className="h-4 w-4 text-gray-600" />
      default:
        return <Icons.dollar className="h-4 w-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return <Loading text="Loading transactions..." />
  }

  if (error) {
    return <Error message={error} onRetry={fetchTransactions} />
  }

  if (transactions.length === 0) {
    return (
      <EmptyState title="No transactions yet" description="Your recent transactions will appear here." icon="dollar" />
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-muted">{getTypeIcon(transaction.transactionType)}</div>
            <div>
              <p className="text-sm font-medium">
                {transaction.transactionType.charAt(0).toUpperCase() +
                  transaction.transactionType.slice(1).toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">{new Date(transaction.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p
              className={`text-sm font-medium ${
                transaction.transactionType.toUpperCase() === "DEPOSIT"
                  ? "text-green-600"
                  : transaction.transactionType.toUpperCase() === "WITHDRAWAL"
                    ? "text-red-600"
                    : ""
              }`}
            >
              {transaction.transactionType.toUpperCase() === "DEPOSIT" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <div className="mt-1">{getStatusBadge(transaction.status)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
