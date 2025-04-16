import { UserAccountNav } from "@/components/user-account-nav"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import type { User } from "next-auth"

interface DashboardHeaderProps {
  user: Pick<User, "name" | "image" | "email">
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <UserAccountNav user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
}
