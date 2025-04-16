"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardNavWrapper() {
  const pathname = usePathname()

  const items = [
    {
      title: "Overview",
      href: "/dashboard",
    },
    {
      title: "Buy Orders",
      href: "/dashboard/buy-orders",
    },
    {
      title: "Sell Orders",
      href: "/dashboard/sell-orders",
    },
    {
      title: "Virtual Accounts",
      href: "/dashboard/virtual-accounts",
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
    },
    {
      title: "Bybit Settings",
      href: "/dashboard/bybit-settings",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
    },
  ]

  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-2 text-sm rounded-md",
            pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
