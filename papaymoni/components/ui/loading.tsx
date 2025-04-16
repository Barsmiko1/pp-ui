import { Icons } from "@/components/icons"

interface LoadingProps {
  text?: string
  size?: "sm" | "md" | "lg"
}

export function Loading({ text = "Loading...", size = "md" }: LoadingProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Icons.spinner className={`${sizeClass[size]} animate-spin text-primary mb-2`} />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
