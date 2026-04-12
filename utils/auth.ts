// Authentication utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
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

export interface RegisterPayload {
  firstname: string
  lastname: string
  email: string
  password: string
  phone?: string
}

export interface RegisterResponse {
  status: boolean
  message: string
  data: {
    user: AuthUser
    token: string
  }
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const getApiUrl = (path: string) => `${API_BASE_URL}${path}`

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const message = 'message' in payload ? payload.message : null

  return typeof message === 'string' && message.trim() ? message : fallback
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
    const response = await fetch(getApiUrl('/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(getErrorMessage(errorData, 'Login failed'))
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

export const registerUser = async (
  payload: RegisterPayload,
  options: { persistSession?: boolean } = {},
): Promise<RegisterResponse> => {
  try {
    const token = getAuthToken()
    const response = await fetch(getApiUrl('/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(getErrorMessage(errorData, 'Registration failed'))
    }

    const data: RegisterResponse = await response.json()

    if (data.status && options.persistSession) {
      setAuthToken(data.data.token)
      setAuthUser(data.data.user)
    }

    return data
  } catch (error) {
    console.error('[v0] Registration error:', error)
    throw error
  }
}

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const token = getAuthToken()
    if (token) {
      await fetch(getApiUrl('/logout'), {
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

export const validateSession = async (): Promise<AuthUser | null> => {
  const token = getAuthToken()

  if (!token) {
    return null
  }

  try {
    const response = await fetch(getApiUrl('/dashboard'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      clearAuthToken()
      return null
    }

    const data = (await response.json()) as {
      user?: AuthUser
    }

    if (data.user) {
      setAuthUser(data.user)
      return data.user
    }

    return getAuthUser()
  } catch (error) {
    console.error('[v0] Session validation error:', error)
    clearAuthToken()
    return null
  }
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
