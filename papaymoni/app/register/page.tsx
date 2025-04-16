"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { cn } from "@/lib/utils"
import { userRegisterSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import Link from "next/link"

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userRegisterSchema>

export default function RegisterPage({ className, ...props }: UserRegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userRegisterSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        throw new Error((await response.json()).message)
      }

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "absolute left-4 top-4 md:left-8 md:top-8")}>
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create your Papay Moni account</p>
        </div>
        <div className={cn("grid gap-6", className)} {...props}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors?.name && <p className="px-1 text-xs text-red-600">{errors.name.message}</p>}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors?.password && <p className="px-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors?.confirmPassword && (
                  <p className="px-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
              <button className={cn(buttonVariants())} disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
