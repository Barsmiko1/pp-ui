import { toast } from "@/components/ui/use-toast"
import type { User, BybitCredentials, Order, Transaction, VirtualAccount, ApiResponse } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
  requiresAuth?: boolean
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, requiresAuth = true } = options

  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    // For client-side requests, we use the /api/proxy endpoint
    const url =
      typeof window !== "undefined"
        ? `/api/proxy/${endpoint.replace(/^\//, "")}`
        : `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    const response = await fetch(url, requestOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "An error occurred")
    }

    return data
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error)

    // Show toast notification for client-side errors
    if (typeof window !== "undefined") {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }

    throw error
  }
}

// User API
export const userApi = {
  getCurrentUser: () => apiRequest<User>("/users/me"),
  updateProfile: (data: Partial<User>) => apiRequest<User>("/users/me", { method: "PUT", body: data }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<void>("/users/change-password", { method: "POST", body: data }),
}

// Bybit API
export const bybitApi = {
  getCredentials: () => apiRequest<BybitCredentials>("/bybit/credentials"),
  saveCredentials: (data: { apiKey: string; apiSecret: string }) =>
    apiRequest<BybitCredentials>("/bybit/credentials", { method: "POST", body: data }),
  verifyCredentials: () => apiRequest<boolean>("/bybit/credentials/verify", { method: "POST" }),
}

// Order API
export const orderApi = {
  getBuyOrders: () => apiRequest<Order[]>("/orders/buy"),
  getSellOrders: () => apiRequest<Order[]>("/orders/sell"),
  getOrderById: (id: string) => apiRequest<Order>(`/orders/${id}`),
  createOrder: (data: Partial<Order>) => apiRequest<Order>("/orders", { method: "POST", body: data }),
  markAsPaid: (id: string, data: { paymentType: string; paymentId: string }) =>
    apiRequest<void>(`/orders/${id}/pay`, { method: "POST", body: data }),
  releaseAssets: (id: string) => apiRequest<void>(`/orders/${id}/release`, { method: "POST" }),
}

// Virtual Account API
export const virtualAccountApi = {
  getAccounts: () => apiRequest<VirtualAccount[]>("/accounts/virtual"),
  createAccount: (data: { currency: string }) =>
    apiRequest<VirtualAccount>("/accounts/virtual", { method: "POST", body: data }),
  getAccountById: (id: string) => apiRequest<VirtualAccount>(`/accounts/virtual/${id}`),
}

// Transaction API
export const transactionApi = {
  getTransactions: (params?: { type?: string; status?: string; fromDate?: string; toDate?: string }) =>
    apiRequest<Transaction[]>("/transactions", {
      method: "GET",
      headers: params
        ? {
            "Content-Type": "application/json",
            ...Object.entries(params).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [`X-Param-${key}`]: String(value),
              }),
              {},
            ),
          }
        : {},
    }),
  getTransactionById: (id: string) => apiRequest<Transaction>(`/transactions/${id}`),
}
