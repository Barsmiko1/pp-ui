"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { EmptyState } from "@/components/ui/empty-state"
import { virtualAccountApi } from "@/lib/api-service"
import type { VirtualAccount } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default function VirtualAccountsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<VirtualAccount[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newAccountCurrency, setNewAccountCurrency] = useState("NGN")
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({})

  const fetchAccounts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await virtualAccountApi.getAccounts()
      setAccounts(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load virtual accounts")
      console.error("Error fetching virtual accounts:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleCreateAccount = async () => {
    if (!newAccountCurrency.trim()) {
      toast({
        title: "Error",
        description: "Currency is required",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      await virtualAccountApi.createAccount({ currency: newAccountCurrency })

      toast({
        title: "Success",
        description: "Virtual account created successfully",
      })

      // Refresh accounts
      await fetchAccounts()
      setIsDialogOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create virtual account",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied({ ...isCopied, [id]: true })

    toast({
      title: "Copied",
      description: "Account number copied to clipboard",
    })

    setTimeout(() => {
      setIsCopied({ ...isCopied, [id]: false })
    }, 2000)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Virtual Accounts</h2>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icons.plus className="mr-2 h-4 w-4" />
                New Virtual Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Virtual Account</DialogTitle>
                <DialogDescription>Create a new virtual account for receiving funds</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currency" className="text-right">
                    Currency
                  </Label>
                  <Input
                    id="currency"
                    value={newAccountCurrency}
                    onChange={(e) => setNewAccountCurrency(e.target.value)}
                    className="col-span-3"
                    placeholder="Enter currency (e.g., NGN)"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAccount} disabled={isCreating}>
                    {isCreating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Virtual Accounts</CardTitle>
          <CardDescription>Manage your virtual accounts for receiving funds</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading text="Loading virtual accounts..." />
          ) : error ? (
            <Error message={error} onRetry={fetchAccounts} />
          ) : accounts.length === 0 ? (
            <EmptyState
              title="No virtual accounts found"
              description="You don't have any virtual accounts yet. Create one to get started."
              icon="wallet"
              actionLabel="Create Virtual Account"
              onAction={() => setIsDialogOpen(true)}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.accountName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono">{account.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.accountNumber, account.id)}
                        >
                          {isCopied[account.id] ? (
                            <Icons.check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Icons.copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{account.bankName}</TableCell>
                    <TableCell>{formatCurrency(account.balance)}</TableCell>
                    <TableCell>
                      {account.active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={fetchAccounts}>
                        <Icons.refresh className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </TableCell>
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
