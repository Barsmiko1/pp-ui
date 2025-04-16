"use client"

import { useSearchParams } from "next/navigation"
import { NewOrderForm } from "@/components/forms/new-order-form"

export default function NewOrderPage() {
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") as "buy" | "sell") || "buy"

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">New {type === "buy" ? "Buy" : "Sell"} Order</h2>
      </div>
      <NewOrderForm type={type} />
    </div>
  )
}
