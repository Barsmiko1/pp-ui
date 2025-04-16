"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { DateRangePicker } from "@/components/date-range-picker"
import { addDays, format } from "date-fns"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { EmptyState } from "@/components/ui/empty-state"
import { transactionApi } from "@/lib/api-service"
import type { Transaction } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Format dates for API
      const params: Record<string, string> = {}
      if (dateRange.from) {
        params.fromDate = format(dateRange.from, "yyyy-MM-dd")
      }
      if (dateRange.to) {
        params.toDate = format(dateRange.to, "yyyy-MM-dd")
      }

      const response = await transactionApi.getTransactions(params)
      setTransactions(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions")
      console.error("Error fetching transactions:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [dateRange])

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

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View your transaction history for the selected date range</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading text="Loading transactions..." />
          ) : error ? (
            <Error message={error} onRetry={fetchTransactions} />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No transactions found"
              description="There are no transactions for the selected date range."
              icon="dollar"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(transaction.transactionType)}
                        <span>{transaction.transactionType}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={
                        transaction.transactionType.toUpperCase() === "DEPOSIT"
                          ? "text-green-600"
                          : transaction.transactionType.toUpperCase() === "WITHDRAWAL"
                            ? "text-red-600"
                            : ""
                      }
                    >
                      {transaction.transactionType.toUpperCase() === "DEPOSIT" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.paymentDetails || "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
