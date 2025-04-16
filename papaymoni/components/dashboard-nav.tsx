"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {}

export function DashboardNav({ className, ...props }: DashboardNavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "chart",
    },
    {
      title: "Buy Orders",
      href: "/dashboard/buy-orders",
      icon: "arrowDown",
    },
    {
      title: "Sell Orders",
      href: "/dashboard/sell-orders",
      icon: "arrowUp",
    },
    {
      title: "Virtual Accounts",
      href: "/dashboard/virtual-accounts",
      icon: "wallet",
    },
    {
      title: "Transactions",
      href: "/dashboard/transactions",
      icon: "dollar",
    },
    {
      title: "Bybit Settings",
      href: "/dashboard/bybit-settings",
      icon: "settings",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "user",
    },
  ]

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.icon && (\
            <Icons[item.icon as keyof typeof Icons] className="mr-2 h-4 w-4" />
          )}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
