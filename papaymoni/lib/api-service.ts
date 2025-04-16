// lib/api-service.ts
import { toast } from "sonner"
import type { User, BybitCredentials, Order, Transaction, VirtualAccount, ApiResponse } from "@/types"

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {} } = options

  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    // Use the /api/proxy route for all requests
    const url = `/api/proxy/${endpoint.replace(/^\//, "")}`

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    console.log(`Making ${method} request to: ${url}`, body ? { body } : "")
    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      // Handle unauthorized error specifically
      if (response.status === 401) {
        // Redirect to login page if unauthorized
        window.location.href = "/login"
        throw new Error("Session expired. Please log in again.")
      }

      // For other errors, try to parse the error message
      const errorData = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Response from ${url}:`, data)
    return data
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error)

    // Show toast notification for client-side errors
    if (error instanceof Error) {
      toast.error(error.message)
    } else {
      toast.error("An unexpected error occurred")
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
  // Updated to use query parameters instead of path segments
  getBuyOrders: () => apiRequest<Order[]>("/orders?side=1"),
  getSellOrders: () => apiRequest<Order[]>("/orders?side=0"),
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
  getTransactions: (params?: Record<string, string>) => {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return apiRequest<Transaction[]>(`/transactions${queryString ? `?${queryString}` : ""}`)
  },
  getTransactionById: (id: string) => apiRequest<Transaction>(`/transactions/${id}`),
}
