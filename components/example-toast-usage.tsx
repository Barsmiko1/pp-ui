"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ToastDemo() {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => toast.success("Operation successful!")}>Show Success Toast</Button>

      <Button onClick={() => toast.error("Something went wrong!")}>Show Error Toast</Button>

      <Button onClick={() => toast.info("Here's some information")}>Show Info Toast</Button>

      <Button
        onClick={() =>
          toast("Custom Toast", {
            description: "This is a custom toast message with more details",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo clicked"),
            },
          })
        }
      >
        Show Custom Toast
      </Button>
    </div>
  )
}
