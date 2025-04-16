"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loading } from "@/components/ui/loading"
import { Error } from "@/components/ui/error"
import { EmptyState } from "@/components/ui/empty-state"
import { orderApi } from "@/lib/api-service"
import type { Order } from "@/types"
import { formatCurrency } from "@/lib/utils"

export default function BuyOrdersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await orderApi.getBuyOrders()
      console.log("Buy orders response:", response)
      setOrders(response.data || [])
    } catch (err) {
      console.error("Error fetching buy orders:", err)
      setError(err instanceof Error ? err.message : "Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  const handleMarkAsPaid = async () => {
    if (!selectedOrder) return

    setIsProcessing(true)
    try {
      await orderApi.markAsPaid(selectedOrder.id, {
        paymentType: "BANK_TRANSFER",
        paymentId: `PAY-${Date.now()}`,
      })

      toast({
        title: "Order marked as paid",
        description: `Order ${selectedOrder.id} has been marked as paid.`,
      })

      // Refresh orders
      await fetchOrders()
      setIsDialogOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to mark order as paid",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 10: // WAITING_FOR_PAYMENT
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case 20: // PAID
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Paid
          </Badge>
        )
      case 70: // COMPLETED
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        )
      case 80: // CANCELLED
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Unknown
          </Badge>
        )
    }
  }

  const getStatusName = (status: number): string => {
    switch (status) {
      case 10:
        return "pending"
      case 20:
        return "paid"
      case 70:
        return "completed"
      case 80:
        return "cancelled"
      default:
        return "unknown"
    }
  }

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => getStatusName(order.status).toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Buy Orders</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/dashboard/new-order?type=buy")}>
            <Icons.plus className="mr-2 h-4 w-4" />
            New Buy Order
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buy Orders</CardTitle>
              <CardDescription>Manage your cryptocurrency buy orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loading text="Loading orders..." />
              ) : error ? (
                <Error message={error} onRetry={fetchOrders} />
              ) : filteredOrders.length === 0 ? (
                <EmptyState
                  title={`No ${activeTab === "all" ? "" : activeTab} orders found`}
                  description={`You don't have any ${activeTab === "all" ? "" : activeTab} buy orders yet.`}
                  icon="arrowDown"
                  actionLabel="Create Buy Order"
                  onAction={() => router.push("/dashboard/new-order?type=buy")}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount (NGN)</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.tokenId}</TableCell>
                        <TableCell>{formatCurrency(order.amount)}</TableCell>
                        <TableCell>{formatCurrency(order.price)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                            <Icons.eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View and manage order {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order-id" className="text-right">
                  Order ID
                </Label>
                <Input id="order-id" value={selectedOrder.id} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset" className="text-right">
                  Asset
                </Label>
                <Input id="asset" value={selectedOrder.tokenId} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" value={formatCurrency(selectedOrder.amount)} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" value={formatCurrency(selectedOrder.price)} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="created" className="text-right">
                  Created
                </Label>
                <Input
                  id="created"
                  value={new Date(selectedOrder.createdAt).toLocaleString()}
                  className="col-span-3"
                  readOnly
                />
              </div>
              {selectedOrder.status === 10 && ( // WAITING_FOR_PAYMENT
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleMarkAsPaid} disabled={isProcessing}>
                    {isProcessing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Paid
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
