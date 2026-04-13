import { getAuthToken } from "./auth"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
}

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") {
    return fallback
  }

  if ("errors" in payload && payload.errors && typeof payload.errors === "object") {
    for (const value of Object.values(payload.errors as Record<string, unknown>)) {
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
        return value[0]
      }
      if (typeof value === "string" && value.trim()) {
        return value
      }
    }
  }

  if ("message" in payload && typeof payload.message === "string" && payload.message.trim()) {
    return payload.message
  }

  return fallback
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api") {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", headers = {}, body, params } = config

    // Build full URL
    const baseUrl = this.baseURL.startsWith("http") ? this.baseURL : `${window.location.origin}${this.baseURL}`
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
    const url = new URL(normalizedEndpoint, normalizedBaseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    // Add authorization token if available
    const token = typeof window !== "undefined" ? getAuthToken() : null
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== "GET") {
      requestConfig.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url.toString(), requestConfig)

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(getErrorMessage(errorData, `HTTP error! status: ${response.status}`))
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return (await response.text()) as unknown as T
    } catch (error) {
      console.error("[v0] API request failed:", error)
      throw error
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params })
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body })
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body })
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  // Utility methods
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.defaultHeaders["Authorization"]
  }

  setBaseURL(url: string) {
    this.baseURL = url
  }
}

// Export a singleton instance
export const apiClient = new ApiClient()

// Export utility functions for common operations
export const api = {
  // Members
  members: {
    getAll: (params?: Record<string, string>) => apiClient.get("/member", params),
    getById: (id: string) => apiClient.get(`/member/${id}`),
    create: (data: any) => apiClient.post("/member/save", data),
    update: (id: string, data: any) => apiClient.put(`/member/${id}`, data),
    getCount: () => apiClient.get("/member/count"),
  },

  dashboard: {
    getStats: () => apiClient.get("/dashboard-stats"),
    getUpcomingBirthdays: (weekOffset = "0") =>
      apiClient.get("/dashboard-upcoming-birthdays", { week_offset: weekOffset }),
  },

  families: {
    getAll: (params?: Record<string, string>) => apiClient.get("/family/list", params),
    getById: (id: string) => apiClient.get(`/family/${id}`),
    create: (data: any) => apiClient.post("/family/save", data),
    update: (id: string, data: any) => apiClient.put(`/family/${id}`, data),
    delete: (id: string) => apiClient.delete(`/family/${id}`),
    addMembers: (id: string, data: any) => apiClient.post(`/family/${id}/members`, data),
    removeMember: (id: string, memberId: string) => apiClient.delete(`/family/${id}/members/${memberId}`),
  },

  // Services
  services: {
    getAll: () => apiClient.get("/services"),
    getById: (id: string) => apiClient.get(`/services/${id}`),
    create: (data: any) => apiClient.post("/services", data),
    update: (id: string, data: any) => apiClient.put(`/services/${id}`, data),
    delete: (id: string) => apiClient.delete(`/services/${id}`),
  },

  // Finance
  finance: {
    getDonations: () => apiClient.get("/finance/donations"),
    getTithes: () => apiClient.get("/finance/tithes"),
    getReports: (params?: any) => apiClient.get("/finance/reports", params),
    createDonation: (data: any) => apiClient.post("/finance/donations", data),
  },

  // Events
  events: {
    getAll: () => apiClient.get("/events"),
    getById: (id: string) => apiClient.get(`/events/${id}`),
    create: (data: any) => apiClient.post("/events", data),
    update: (id: string, data: any) => apiClient.put(`/events/${id}`, data),
    delete: (id: string) => apiClient.delete(`/events/${id}`),
    getRSVPs: (eventId: string) => apiClient.get(`/events/${eventId}/rsvps`),
  },

  // Communication
  communication: {
    sendSMS: (data: any) => apiClient.post("/communication/sms", data),
    sendEmail: (data: any) => apiClient.post("/communication/email", data),
    getTemplates: () => apiClient.get("/communication/templates"),
  },

  // Groups
  groups: {
    getAll: () => apiClient.get("/groups"),
    getById: (id: string) => apiClient.get(`/groups/${id}`),
    create: (data: any) => apiClient.post("/groups", data),
    update: (id: string, data: any) => apiClient.put(`/groups/${id}`, data),
    delete: (id: string) => apiClient.delete(`/groups/${id}`),
    getMembers: (groupId: string) => apiClient.get(`/groups/${groupId}/members`),
  },
}
