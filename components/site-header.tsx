import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserAccountNav } from "@/components/user-account-nav"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function SiteHeader() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
