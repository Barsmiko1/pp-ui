"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface ErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function Error({
  title = "Something went wrong",
  message = "An error occurred while loading the data. Please try again.",
  onRetry,
}: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icons.warning className="h-8 w-8 text-destructive mb-2" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <Icons.refresh className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
