type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string>
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL = "/api") {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, window.location.origin + this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", headers = {}, body, params } = config

    const url = this.buildURL(endpoint, params)

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    }

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body && method !== "GET") {
      requestConfig.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, requestConfig)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      }

      return (await response.text()) as unknown as T
    } catch (error) {
      console.error("API request failed:", error)
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
    getAll: () => apiClient.get("/members"),
    getById: (id: string) => apiClient.get(`/members/${id}`),
    create: (data: any) => apiClient.post("/members", data),
    update: (id: string, data: any) => apiClient.put(`/members/${id}`, data),
    delete: (id: string) => apiClient.delete(`/members/${id}`),
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
