"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { toast } from "sonner"
import { orderApi } from "@/lib/api-service"

interface NewOrderFormProps {
  type: "buy" | "sell"
}

export function NewOrderForm({ type }: NewOrderFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    tokenId: "USDT",
    currencyId: "NGN",
    amount: "",
    price: "",
    quantity: "",
    targetNickName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const calculateQuantity = () => {
    if (formData.amount && formData.price) {
      const amount = Number.parseFloat(formData.amount)
      const price = Number.parseFloat(formData.price)
      if (!isNaN(amount) && !isNaN(price) && price > 0) {
        const quantity = amount / price
        setFormData({ ...formData, quantity: quantity.toFixed(8) })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.tokenId || !formData.currencyId || !formData.amount || !formData.price || !formData.targetNickName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await orderApi.createOrder({
        tokenId: formData.tokenId,
        currencyId: formData.currencyId,
        side: type === "buy" ? 1 : 0, // 1 for buy, 0 for sell
        amount: Number.parseFloat(formData.amount),
        price: Number.parseFloat(formData.price),
        quantity: Number.parseFloat(formData.quantity),
        targetNickName: formData.targetNickName,
      })

      toast({
        title: "Success",
        description: `Your ${type} order has been created successfully`,
      })

      // Redirect to the appropriate orders page
      router.push(type === "buy" ? "/dashboard/buy-orders" : "/dashboard/sell-orders")
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : `Failed to create ${type} order`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create {type === "buy" ? "Buy" : "Sell"} Order</CardTitle>
        <CardDescription>
          {type === "buy"
            ? "Create a new buy order to purchase cryptocurrency"
            : "Create a new sell order to sell cryptocurrency"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tokenId">Crypto Asset</Label>
              <Select value={formData.tokenId} onValueChange={(value) => handleSelectChange("tokenId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crypto asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currencyId">Fiat Currency</Label>
              <Select value={formData.currencyId} onValueChange={(value) => handleSelectChange("currencyId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fiat currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                  <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                  <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({formData.currencyId})</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                onBlur={calculateQuantity}
                placeholder={`Enter amount in ${formData.currencyId}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price per {formData.tokenId}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                onBlur={calculateQuantity}
                placeholder={`Price in ${formData.currencyId}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({formData.tokenId})</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.00000001"
                value={formData.quantity}
                onChange={handleChange}
                placeholder={`Quantity in ${formData.tokenId}`}
                readOnly
              />
              <p className="text-xs text-muted-foreground">Calculated automatically</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetNickName">{type === "buy" ? "Seller" : "Buyer"} Nickname</Label>
              <Input
                id="targetNickName"
                name="targetNickName"
                value={formData.targetNickName}
                onChange={handleChange}
                placeholder={`Enter ${type === "buy" ? "seller" : "buyer"} nickname`}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(type === "buy" ? "/dashboard/buy-orders" : "/dashboard/sell-orders")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create {type === "buy" ? "Buy" : "Sell"} Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
