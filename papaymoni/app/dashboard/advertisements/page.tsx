// app/dashboard/advertisements/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function AdvertisementsPage() {
  const { data: session } = useSession()
  const [advertisements, setAdvertisements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    type: "BUY",
    cryptoAsset: "BTC",
    fiatCurrency: "NGN",
    price: "",
    minAmount: "",
    maxAmount: "",
    paymentMethods: "BANK_TRANSFER",
    remarks: "",
  })

  useEffect(() => {
    const fetchAdvertisements = async () => {
      if (!session?.accessToken) return;
      
      try {
        setIsLoading(true);
        const response = await fetch("/api/proxy/bybit/advertisements", {
          headers: {
            "Content-Type": "application/json",
            // Let the proxy middleware handle the token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }

        const data = await response.json();
        setAdvertisements(data.data || []);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
        toast.error("Failed to load advertisements");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchAdvertisements();
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      id: null,
      type: "BUY",
      cryptoAsset: "BTC",
      fiatCurrency: "NGN",
      price: "",
      minAmount: "",
      maxAmount: "",
      paymentMethods: "BANK_TRANSFER",
      remarks: "",
    })
  }

  const handleEdit = (advertisement: any) => {
    setFormData({
      id: advertisement.id,
      type: advertisement.type,
      cryptoAsset: advertisement.cryptoAsset,
      fiatCurrency: advertisement.fiatCurrency,
      price: advertisement.price.toString(),
      minAmount: advertisement.minAmount.toString(),
      maxAmount: advertisement.maxAmount.toString(),
      paymentMethods: advertisement.paymentMethods,
      remarks: advertisement.remarks || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) {
      return
    }

    try {
      const response = await fetch(`/api/proxy/bybit/advertisements/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Let the proxy middleware handle the token
        },
      })

      if (response.ok) {
        setAdvertisements(advertisements.filter((ad: any) => ad.id !== id));
        toast.success("Advertisement deleted successfully");
      } else {
        toast.error("Failed to delete advertisement");
      }
    } catch (error) {
      console.error("Error deleting advertisement:", error);
      toast.error("An unexpected error occurred");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        minAmount: Number.parseFloat(formData.minAmount),
        maxAmount: Number.parseFloat(formData.maxAmount),
      }

      const method = formData.id ? "PUT" : "POST"
      const endpoint = formData.id
        ? `/api/proxy/bybit/advertisements/${formData.id}`
        : "/api/proxy/bybit/advertisements"

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          // Let the proxy middleware handle the token
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()

        if (formData.id) {
          setAdvertisements(advertisements.map((ad: any) => (ad.id === formData.id ? data.data : ad)))
          toast.success("Advertisement updated successfully");
        } else {
          setAdvertisements([...advertisements, data.data])
          toast.success("Advertisement created successfully");
        }

        setDialogOpen(false)
        resetForm()
      } else {
        toast.error("Failed to save advertisement");
      }
    } catch (error) {
      console.error("Error saving advertisement:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Advertisements</h1>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Create Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Advertisement" : "Create Advertisement"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">Buy (I want to buy crypto)</SelectItem>
                      <SelectItem value="SELL">Sell (I want to sell crypto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cryptoAsset">Crypto Asset</Label>
                  <Select
                    name="cryptoAsset"
                    value={formData.cryptoAsset}
                    onValueChange={(value) => handleSelectChange("cryptoAsset", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiatCurrency">Fiat Currency</Label>
                  <Select
                    name="fiatCurrency"
                    value={formData.fiatCurrency}
                    onValueChange={(value) => handleSelectChange("fiatCurrency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                      <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                      <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per {formData.cryptoAsset}</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder={`Price in ${formData.fiatCurrency}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Minimum Amount</Label>
                  <Input
                    id="minAmount"
                    name="minAmount"
                    type="number"
                    value={formData.minAmount}
                    onChange={handleChange}
                    required
                    placeholder={`Min amount in ${formData.fiatCurrency}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Amount</Label>
                  <Input
                    id="maxAmount"
                    name="maxAmount"
                    type="number"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    required
                    placeholder={`Max amount in ${formData.fiatCurrency}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethods">Payment Methods</Label>
                <Select
                  name="paymentMethods"
                  value={formData.paymentMethods}
                  onValueChange={(value) => handleSelectChange("paymentMethods", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                    <SelectItem value="CASH_DEPOSIT">Cash Deposit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional information or requirements"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Advertisement"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Advertisements</CardTitle>
        </CardHeader>
        <CardContent>
          {advertisements.length === 0 ? (
            <div className="text-center py-6 text-gray-500">You haven&apos;t created any advertisements yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Limits</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.map((ad: any) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          ad.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ad.type === "BUY" ? "Buy" : "Sell"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {ad.cryptoAsset}/{ad.fiatCurrency}
                    </TableCell>
                    <TableCell>
                      {ad.price.toLocaleString()} {ad.fiatCurrency}
                    </TableCell>
                    <TableCell>
                      {ad.minAmount.toLocaleString()} - {ad.maxAmount.toLocaleString()} {ad.fiatCurrency}
                    </TableCell>
                    <TableCell>{ad.paymentMethods.replace("_", " ")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(ad.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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