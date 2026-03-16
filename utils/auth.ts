// Authentication utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface LoginCredentials {
  email: string
  password: string
  remmeberMe?: boolean
}

export interface AuthUser {
  id: string
  firstname: string
  lastname: string
  email: string
  email_verified_at: string | null
  status: string
  phone: string
  avatar_url: string | null
  preferences: string | null
  created_at: string
  updated_at: string
  roles: Array<{
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
    permissions: Array<{
      id: number
      name: string
      guard_name: string
      created_at: string
      updated_at: string
    }>
  }>
}

export interface LoginResponse {
  status: boolean
  message: string
  data: {
    status: boolean
    user: AuthUser
    token: string
    token_expires_at: string
  }
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Store token in localStorage
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

// Get token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

// Remove token from localStorage
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }
}

// Store user data
export const setAuthUser = (user: AuthUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(user))
  }
}

// Get user data
export const getAuthUser = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('auth_user')
    return user ? JSON.parse(user) : null
  }
  return null
}

// Login function
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        remmeberMe: credentials.remmeberMe || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data: LoginResponse = await response.json()

    if (data.status) {
      setAuthToken(data.data.token)
      setAuthUser(data.data.user)
    }

    return data
  } catch (error) {
    console.error('[v0] Login error:', error)
    throw error
  }
}

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const token = getAuthToken()
    if (token) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
    }
  } catch (error) {
    console.error('[v0] Logout error:', error)
  } finally {
    clearAuthToken()
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!getAuthToken()
  }
  return false
}

// Get user permissions
export const getUserPermissions = (): string[] => {
  const user = getAuthUser()
  if (!user || !user.roles || user.roles.length === 0) {
    return []
  }

  const permissions = new Set<string>()
  user.roles.forEach((role) => {
    role.permissions?.forEach((permission) => {
      permissions.add(permission.name)
    })
  })

  return Array.from(permissions)
}

// Check if user has permission
export const hasPermission = (permission: string): boolean => {
  const permissions = getUserPermissions()
  return permissions.includes(permission)
}

// Get user roles
export const getUserRoles = (): string[] => {
  const user = getAuthUser()
  if (!user || !user.roles) {
    return []
  }
  return user.roles.map((role) => role.name)
}
