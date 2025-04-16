"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { useSession } from "next-auth/react"

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">Papay Moni</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              pathname === "/" && "font-bold",
            )}
          >
            Home
          </Link>
          <Link
            href="/features"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              pathname?.startsWith("/features") && "font-bold",
            )}
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              pathname?.startsWith("/pricing") && "font-bold",
            )}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              pathname?.startsWith("/about") && "font-bold",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
              pathname?.startsWith("/contact") && "font-bold",
            )}
          >
            Contact
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                pathname?.startsWith("/dashboard") && "font-bold",
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
