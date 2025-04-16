"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: keyof typeof Icons
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = "No data found",
  description = "There are no items to display at this time.",
  icon = "inbox",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = Icons[icon]

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
