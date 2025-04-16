import type React from "react"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth"
import Link from "next/link"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = await auth()

  if (!session) {
    return notFound()
  }

  // Simple navigation items
  const navItems = [
    { title: "Overview", href: "/dashboard" },
    { title: "Buy Orders", href: "/dashboard/buy-orders" },
    { title: "Sell Orders", href: "/dashboard/sell-orders" },
    { title: "Virtual Accounts", href: "/dashboard/virtual-accounts" },
    { title: "Transactions", href: "/dashboard/transactions" },
    { title: "Bybit Settings", href: "/dashboard/bybit-settings" },
    { title: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <nav className="flex flex-col space-y-1 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
